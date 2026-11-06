# Environment & MongoDB

## 1. One-command setup

```bash
npm run setup                                   # local MongoDB, owner "owner", random password
npm run setup -- --atlas "mongodb+srv://user:pass@cluster.mongodb.net/"
npm run setup -- --db hamper_queen_staging --admin-user supriya --base-url https://staging.example.com
npm run setup -- --force                        # overwrite an existing .env
```

`scripts/setup-env.mjs` writes `.env` with mode `600`, refuses to overwrite without `--force`,
and prints the generated owner password **once**. The password also sits in `.env` as
`HQ_BOOTSTRAP_ADMIN_PASSWORD` until the bootstrap creates the owner, at which point the line is
commented out automatically. Save the password in your password manager.

## 2. Variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `MONGODB_URI` | yes (runtime) | – | `mongodb://127.0.0.1:27017/` locally, `mongodb+srv://…` on Atlas |
| `MONGODB_DB` | no | `hamper_queen` | Database name for the app **and** every script. Use one per environment |
| `MONGODB_DIRECT_HOSTS` | no | original Atlas shards | Comma-separated shard hosts for the SRV-DNS fallback. Change only when you move Atlas clusters |
| `HQ_BASE_URL` | recommended | `https://hamper-queen.vercel.app` | Public origin for sitemap, robots, OpenGraph, canonical URLs. A `localhost` value is ignored in production builds |
| `HQ_BOOTSTRAP_ADMIN_USER` | bootstrap only | prompt | First owner's username |
| `HQ_BOOTSTRAP_ADMIN_PASSWORD` | bootstrap only | prompt | First owner's password, min 8 chars. Auto-removed afterwards |
| `HQ_ENV_FILE` | no | `.env` | Which env file the bootstrap / reset scripts read/scrub |
| `HQ_RESET_ADMIN_USER` | reset only | prompt | Username for `npm run db:reset-admin` (create or reset). **Never set on the host** |
| `HQ_RESET_ADMIN_PASSWORD` | reset only | hidden prompt | New password for the same script, min 8 chars. Prefer the prompt so it stays out of shell history |
| `HQ_ADMIN_USER` | test only | – | Admin username used by `npm run db:test-promo` (`scripts/test-promo.mjs`). **Never set on the host** |
| `HQ_ADMIN_PASS` | test only | – | Admin password for the same test script. **Never set on the host** |
| `BASE_URL` | check only | – | Origin that `npm run check:ssr` requests, e.g. `BASE_URL=https://your-domain npm run check:ssr` |

Without `MONGODB_URI` the storefront still renders from the static catalogue; ordering, tracking and
the admin panel return a graceful 503 instead of crashing.

## 3. Local MongoDB

```bash
npm run db:up      # docker compose up -d mongo   (127.0.0.1:27017, data in the mongo_data volume)
npm run db:logs
npm run db:down    # stop; add `-v` via `docker compose down -v` to delete the data
docker compose --profile tools up -d    # + web UI at http://localhost:8081
```

The compose file binds to `127.0.0.1` and runs **without auth** - development only.

## 4. Bootstrap the database

```bash
npm run db:bootstrap     # reads .env
npm run db:setup         # = setup (if .env missing) + bootstrap
npm run db:test          # connectivity check only
npm run db:test-promo    # promo-code redemption self-test (writes test rows)
```

`scripts/bootstrap-db.mjs` is idempotent. It:

1. connects (SRV first, direct-host fallback for `mongodb+srv://` on restrictive networks);
2. ensures the collections and indexes below (skipping equivalent indexes that already exist);
3. creates the owner admin **only if `adminUsers` is empty** (scrypt-hashed);
4. scrubs the bootstrap password from `.env`.

| Collection | Indexes (canonical names) |
| --- | --- |
| `orders` | `uniq_trackingId` (unique), `idx_status`, `idx_createdAt` |
| `catalogOverrides` | `uniq_productId` (unique) |
| `promoCodes` | `idx_code`, `idx_redeemedAt` |
| `adminUsers` | `uniq_username` (unique) |
| `sessions` | `uniq_token` (unique), `ttl_expiresAt` (TTL on `expiresAt`) |

The app uses the **same names** (`src/lib/mongo.ts › ensureIndex`) and accepts an equivalent index that
exists under another name, so databases created by either path work. Indexes are checked once per
process, not on every request.

## 5. Production (Atlas + Vercel)

1. Create the Atlas cluster, a DB user, and allow your host's egress IPs (Vercel: `0.0.0.0/0` or the Vercel IP-allow integration).
2. Set `MONGODB_URI`, `MONGODB_DB`, `HQ_BASE_URL` in the host's environment settings. **Do not** set the bootstrap variables there.
3. From your laptop run the bootstrap once against production: `npm run setup -- --atlas "<uri>" --db hamper_queen --out .env.production` then `HQ_ENV_FILE=.env.production node --env-file=.env.production scripts/bootstrap-db.mjs`.
4. Deploy, then `BASE_URL=https://your-domain npm run check:ssr`.

### Deployment environment (`.env.production`)

`.env.production` (gitignored, mode 600) and its safe template `.env.production.example` hold exactly
the variables the **running app** reads. Paste them into the host's environment settings
(Vercel: Project → Settings → Environment Variables → Production).

| Variable | Set on host? | Value |
| --- | --- | --- |
| `MONGODB_URI` | **yes (required)** | Atlas `mongodb+srv://…` string. Carried over from your local `.env` |
| `MONGODB_DB` | **yes** | `hamper_queen` (your local `.env` did not set it, so this was the implicit default; keep it to reuse the same data) |
| `HQ_BASE_URL` | **yes** | Your real public origin, e.g. `https://www.example.com`. Replace the `https://your-domain.example` placeholder |
| `MONGODB_DIRECT_HOSTS` | only if SRV DNS is blocked | Comma-separated shard hosts |
| `HQ_BOOTSTRAP_ADMIN_USER` / `_PASSWORD` | **no** | Bootstrap-only, run from your laptop |
| `HQ_ADMIN_USER` / `HQ_ADMIN_PASS` | **no** | Test script only (`db:test-promo`) |
| `HQ_ENV_FILE`, `HQ_RESET_ADMIN_USER`, `HQ_RESET_ADMIN_PASSWORD` | **no** | Local helper scripts only |

How your local `.env` maps to deployment:

| Local `.env` | Deployment |
| --- | --- |
| `MONGODB_URI` | Copied unchanged to `MONGODB_URI` |
| *(missing)* | Add `MONGODB_DB=hamper_queen` and `HQ_BASE_URL=<your domain>` |
| `HQ_ADMIN_USER`, `HQ_ADMIN_PASS` | Leave out. They are local test credentials. The live admin account lives in the `adminUsers` collection |
| `HQ_BOOTSTRAP_ADMIN_*` (commented) | Leave out |

Redeploy after changing environment variables (Vercel only applies them to new deployments). If a
database password ever appears in a chat, screenshot or commit, rotate it in Atlas (Database Access).

## 6. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| "Could not save your order" and `IndexOptionsConflict` (code 85) in logs | An older build created `trackingId_1` while bootstrap created `uniq_trackingId`. Fixed in 2.2.0 (conflicts are accepted). Update and redeploy |
| `querySrv ECONNREFUSED` | Network blocks SRV DNS. The app/scripts retry with direct hosts automatically; set `MONGODB_DIRECT_HOSTS` if your cluster changed |
| Admin says "Incorrect username or password" but you are sure | Run `npm run db:reset-admin`. Common causes: the owner was bootstrapped with a different/placeholder password, or the host points at a different `MONGODB_DB` than the one you bootstrapped |
| Admin login "Too many attempts" (429) | 8 failed tries from your IP in 15 min. Wait 15 minutes (or redeploy to clear the in-memory counter) |
| Login succeeds but `/admin` shows the form again | The `hq_admin` cookie is `Secure` in production, so it only works over **https** (or `localhost` in Chrome/Firefox). Use the https domain; `next start` over plain http on a LAN IP will not keep the session |
| Admin login always 503 | `MONGODB_URI` missing/wrong, or IP not allow-listed in Atlas |
| Sessions never purge | The server has no TTL-index support (some Mongo-compatible databases). Harmless: expiry is also enforced on read |
| Sitemap/OG show the wrong domain | Set `HQ_BASE_URL` (non-localhost) in the production environment |
