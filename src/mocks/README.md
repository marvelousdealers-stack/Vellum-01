# src/mocks — fake backend (dev only)

There is no backend yet, so this folder plays one. It is **not** part of the
app: it intercepts `fetch` for `/api/*` (see `server.js`) and answers exactly
as `API-CONTRACT.md` says a real server must — bearer tokens, status codes,
`_id` + ISO-date JSON, latency — so the frontend runs the same code it will
run against the real thing.

- `handlers.js` — one handler per endpoint (the contract, as code)
- `engine.js` — rules a real backend owns: test status, who sees what,
  result release, totals
- `generator.js`, `grader.js` — stand-ins for the LLM calls
- `db.js` — fake database in localStorage, plus seed data

Enabled unless `VITE_USE_MOCK=false`. When the real server exists: set that
variable and delete this folder. Reset demo data with `__resetVellum()` in the
browser console.
