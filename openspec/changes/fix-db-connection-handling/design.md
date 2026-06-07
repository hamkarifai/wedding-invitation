## Context

`src/server/lib/db-client.js` exposes `getDbClient(c)`, the single entry point every API route uses to talk to PostgreSQL. It currently has two defects:

1. **Per-request pool leak.** The `DATABASE_URL` branch runs `new Pool({ connectionString })` inside the request handler and returns it without ever calling `pool.end()`. Each request opens a fresh pool; under load the database exhausts `max_connections`.
2. **Broken Hyperdrive path.** The branch `if (c.env?.DB) return c.env.DB;` assumes the Hyperdrive binding is a queryable object. Hyperdrive bindings expose a **connection string** (commonly `c.env.DB.connectionString`), not a `.query()` method, so the edge deployment path advertised in the README and `wrangler.jsonc.example` does not work.

Constraints that shape the fix:

- **Contract must not change.** Routes call `const pool = await getDbClient(c)` then `pool.query(sql, params)`. Unit/e2e tests mock the entire module (`vi.mock(".../db-client.js")`), so as long as the exported function name and return shape (`{ query }` → `{ rows }`) are preserved, no consumer or test needs editing.
- **Two runtimes.** Node/Bun (`bun run dev:server`, `generate-links`) and Cloudflare Workers (`wrangler dev`/`deploy`). The same module is bundled for both, so the implementation must not hard-fail at import time in either.
- **`pg` is the only driver in use.** `nodejs_compat` is already enabled in `wrangler.jsonc.example:12`, which is what lets `pg` run on Workers when pointed at a Hyperdrive connection string.

## Goals / Non-Goals

**Goals:**

- Create each connection pool **once** per connection source and reuse it across requests.
- Make the Hyperdrive path build a working client from the binding's **connection string**.
- Preserve the `getDbClient(c)` signature and `{ query }`/`{ rows }` return shape exactly.
- Throw a clear, actionable error when no connection source is configured.
- Cover the helper directly with unit tests (reuse, Hyperdrive path, error path).

**Non-Goals:**

- Authentication / authorization on routes (separate change).
- Tenant isolation, guest tokens, CORS scoping (separate change).
- Schema/migration changes.
- Replacing `pg` with another driver (e.g. `postgres`, Neon serverless).

## Decisions

**1. Module-level pool cache keyed by connection string.**
Maintain a module-scoped `Map<connectionString, Pool>`. `getDbClient` resolves the connection string for the current request, looks it up in the map, and creates+stores a pool only on a miss.

- *Why:* A module-scoped cache is the simplest correct way to get "create once, reuse many" without a DI container. Keying by connection string keeps it correct if more than one source is ever used and makes the reuse behavior directly testable.
- *Alternatives considered:* (a) A single top-level `new Pool()` at import time — rejected because it would attempt a connection in the Workers bundle even when only the Hyperdrive path is used, and would crash import when no URL is set. (b) Storing the pool on `c.env` — rejected because `c.env` lifetime and identity differ between Node and Workers and isn't a reliable cache.

**2. Resolve the connection string uniformly, then always go through `pg.Pool`.**
Resolution order: `c.env.DB.connectionString` (Hyperdrive) → `c.env.DATABASE_URL` (dev/Node) → throw. Both valid sources collapse to "a connection string," which feeds one `pg.Pool` construction path.

- *Why:* Hyperdrive's job is to hand the driver a pooled connection string; `pg` + `nodejs_compat` then works the same as in Node. Collapsing both sources to one code path removes the divergence that caused the original bug and means one tested construction routine serves both runtimes.
- *Alternatives considered:* Treating `c.env.DB` as already-queryable (current behavior) — rejected, that's the bug. Branching into two entirely separate client implementations — rejected as needless surface area since both end at `pg.Pool`.

**3. Keep `pg` imported via dynamic `import("pg")`.**
Retain the existing lazy `await import("pg")` rather than a top-level static import.

- *Why:* Avoids pulling `pg` into module-eval on the Workers cold path before it's needed and matches the current working pattern. The result is memoized in the pool cache, so the dynamic import cost is paid once.

**4. Preserve the async signature.**
`getDbClient` stays `async`. The dynamic import and the existing `await getDbClient(c)` call sites require it.

## Risks / Trade-offs

- **[Hyperdrive binding shape may differ from `.connectionString`]** → Read the binding defensively: prefer `c.env.DB.connectionString`, and if the binding is a string use it directly. Document the expected shape in code comments and the spec scenario so a future runtime change is caught by tests.
- **[Module-level cache persists a broken pool if the DB was briefly unreachable]** → Acceptable for this change: `pg.Pool` already manages and replaces individual broken connections internally. Pool-level eviction/health-checking is out of scope and can be a follow-up if it proves necessary.
- **[Workers isolates each have their own module scope]** → Expected and fine. The cache reuses within an isolate's lifetime, which is exactly where per-request pool creation was leaking. Cross-isolate sharing is Hyperdrive's responsibility, not the app's.
- **[Long-lived pools in `generate-links` script]** → The standalone script uses `node-pool.js` directly, not `getDbClient`, so it is unaffected. No change needed there.

## Migration Plan

1. Rewrite `getDbClient` with the cached-pool + unified-connection-string approach.
2. Add `src/server/lib/db-client.spec.js` covering reuse, Hyperdrive path, DATABASE_URL path, and the no-config error.
3. Run `bun run test` (unit + e2e) and `bun run lint` / `format:check` — the pre-push gate.
4. Verify `bun run dev:server` connects locally via `DATABASE_URL`.
5. **Rollback:** the change is isolated to one file plus one new test; revert the file to restore prior behavior. No data or schema migration is involved.

## Open Questions

- Confirm the exact Hyperdrive binding accessor for this project's `wrangler` version (`c.env.DB.connectionString` is the current convention). If a real Hyperdrive binding is available, validate against it during implementation; otherwise the defensive read above covers both string and object shapes.
