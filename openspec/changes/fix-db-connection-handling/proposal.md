## Why

The current database access layer leaks connections and the advertised edge deployment path is non-functional. `getDbClient()` constructs a **brand-new `pg.Pool` on every request** in the `DATABASE_URL` branch (`src/server/lib/db-client.js:25`) and never closes it, so sockets accumulate until PostgreSQL refuses new connections. On the Cloudflare Workers path, the code returns `c.env.DB` and immediately calls `.query()` on it, but Hyperdrive exposes a **connection string**, not a queryable pool — so the deployment target the README sells as primary does not work as written. This is the foundational data layer that every route depends on, so it must be correct before any other hardening or feature work.

## What Changes

- Replace per-request `Pool` construction with a **single reused pool** keyed by connection string, created lazily and cached across requests within the same runtime instance.
- Fix the Cloudflare Workers / Hyperdrive path so it produces a working query interface from the Hyperdrive **connection string** (`c.env.DB.connectionString`) rather than assuming the binding is itself queryable.
- Preserve the existing `getDbClient(c)` contract: it still returns an object exposing an async `.query(sql, params)` method, so all current routes and the module-level test mocks (`vi.mock(".../db-client.js")`) continue to work unchanged.
- Add explicit, actionable errors when no connection source is available (no Hyperdrive binding and no `DATABASE_URL`).
- Add unit tests proving: the pool is reused across calls, the Hyperdrive path builds a client from the connection string, and the no-config path throws a clear error.

Non-goals: authentication, tenant isolation hardening, CORS scoping, or schema changes. Those are tracked separately.

## Capabilities

### New Capabilities
- `database-connection`: How the server obtains a database query client across Node/Bun and Cloudflare Workers (Hyperdrive) environments, including pool reuse semantics, the resolution order of connection sources, and error behavior when none is configured.

### Modified Capabilities
<!-- None: openspec/specs/ is currently empty, so there is no existing requirement-level spec to modify. -->

## Impact

- **Code**: `src/server/lib/db-client.js` (rewrite of `getDbClient`), new `src/server/lib/db-client.spec.js`.
- **Consumers (no signature change)**: `src/server/index.js`, `src/server/features/invitation/routes.js`, `src/server/features/wishes/routes.js` — all call `getDbClient(c)` then `.query()`; the returned shape is preserved.
- **Deployment**: Fixes the Cloudflare Workers + Hyperdrive path described in `wrangler.jsonc.example` and the README; clarifies the `DATABASE_URL` fallback used in Wrangler dev and `bun run dev:server`.
- **Dependencies**: continues to use `pg`; no new runtime dependencies.
- **Tests**: existing unit/e2e suites mock the whole `db-client` module and are unaffected; new tests cover the helper directly.
