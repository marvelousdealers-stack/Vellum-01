import { fromWire, toWire } from "@/api/wire";
import { db, users } from "./db";
import { HttpError, routes, sweep } from "./handlers";

// ═══════════════════════════════════════════════════════════════
// FAKE SERVER (dev only)
//
// Replaces `window.fetch` for URLs under the API base, so the app talks to it
// through the exact same code path as a real backend: real requests, JSON
// bodies, bearer tokens, status codes, `_id` + ISO-date payloads, latency.
// Delete src/mocks when the real server exists — nothing else imports it.
// ═══════════════════════════════════════════════════════════════
const compile = (path) => {
  const keys = [];
  const re = new RegExp(
    `^${path.replace(/:[^/]+/g, (m) => (keys.push(m.slice(1)), "([^/]+)"))}$`,
  );
  return { re, keys };
};
const table = routes.map((r) => ({ ...r, ...compile(r.path) }));

// Responses use the conventions a MongoDB/Express backend would: `_id` and
// ISO-8601 strings. (api/wire.js converts them back on the client.)
const toServerShape = (value) => {
  if (Array.isArray(value)) return value.map(toServerShape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k === "id" ? "_id" : k, toServerShape(v)]),
    );
  }
  return value;
};
const serialize = (data) => toServerShape(toWire(data));

const json = (status, body) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const userFromRequest = (headers) => {
  const token = /^Bearer (.+)$/.exec(headers.get("Authorization") ?? "")?.[1] ?? "";
  const id = token.startsWith("mock.") ? token.slice(5) : null;
  const u = users().find((x) => x.id === id);
  return u?.active === false ? null : (u ?? null); // a deactivated account's token stops working
};

export const installMockServer = ({ baseUrl, latency = [120, 320] } = {}) => {
  const realFetch = window.fetch.bind(window);
  db(); // load or seed up front
  // baseUrl may be a path ("/api") or a full URL ("http://localhost:5000/api").
  const base = new URL(baseUrl, window.location.origin);
  const basePath = base.pathname.replace(/\/$/, "");

  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url, window.location.origin);
    if (url.origin !== base.origin || !url.pathname.startsWith(basePath)) {
      return realFetch(input, init);
    }

    const path = url.pathname.slice(basePath.length) || "/";
    const method = (init.method ?? "GET").toUpperCase();
    const match = table
      .filter((r) => r.method === method)
      .map((r) => ({ r, m: r.re.exec(path) }))
      .find((x) => x.m);
    await sleep(match?.r.delay ?? latency[0] + Math.random() * (latency[1] - latency[0]));
    if (!match) return json(404, { message: `No such endpoint: ${method} ${path}` });

    try {
      const now = Date.now();
      const user = userFromRequest(new Headers(init.headers));
      if (!match.r.public && !user) return json(401, { message: "Please sign in again" });
      sweep(now);

      const params = Object.fromEntries(
        match.r.keys.map((k, i) => [k, decodeURIComponent(match.m[i + 1])]),
      );
      // JSON bodies are parsed; multipart uploads (FormData) are left alone.
      const body =
        typeof init.body === "string" ? fromWire(JSON.parse(init.body)) : (init.body ?? undefined);
      const result = match.r.handler({
        user,
        params,
        body,
        query: Object.fromEntries(url.searchParams),
        now,
      });
      return json(200, serialize(result));
    } catch (err) {
      if (err instanceof HttpError) {
        return json(err.status, { message: err.message, code: err.code });
      }
      console.error("[mock server]", err);
      return json(500, { message: "The (fake) server hit an error" });
    }
  };
};
