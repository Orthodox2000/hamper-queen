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
| `HQ_ENV_FILE` | no | `.env` | Which env file the bootstrap script reads/scrubs |

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

## 6. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| "Could not save your order" and `IndexOptionsConflict` (code 85) in logs | An older build created `trackingId_1` while bootstrap created `uniq_trackingId`. Fixed in 2.2.0 (conflicts are accepted). Update and redeploy |
| `querySrv ECONNREFUSED` | Network blocks SRV DNS. The app/scripts retry with direct hosts automatically; set `MONGODB_DIRECT_HOSTS` if your cluster changed |
| Admin login always 503 | `MONGODB_URI` missing/wrong, or IP not allow-listed in Atlas |
| Sessions never purge | The server has no TTL-index support (some Mongo-compatible databases). Harmless: expiry is also enforced on read |
| Sitemap/OG show the wrong domain | Set `HQ_BASE_URL` (non-localhost) in the production environment |
