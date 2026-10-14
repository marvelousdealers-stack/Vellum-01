import { USE_MOCK, call } from "./client";

// ═══════════════════════════════════════════════════════════════
// AUTH API (API-CONTRACT.md "Auth")
//
//   POST /api/auth/login  { email, password }  → { token, user }
//   GET  /api/auth/me                          → user
//
// user = { id, name, email, role: "admin"|"teacher"|"student", cls?, roll? }
// The real backend derives the role from the account. Only the fake server
// also reads a `role` hint (so the demo can sign in as anyone), which is why
// it is sent in mock mode alone.
// ═══════════════════════════════════════════════════════════════
export const login = ({ email, password, role }) =>
  call("/auth/login", {
    method: "POST",
    body: { email, password, ...(USE_MOCK ? { role } : {}) },
  });

export const fetchMe = () => call("/auth/me");
