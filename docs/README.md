# Hamper Queen — internal documentation

Start here. Each guide is short, task-oriented and kept next to the code it describes.

| Guide | Read it when you want to… |
| --- | --- |
| [ENVIRONMENT.md](./ENVIRONMENT.md) | set up a machine, create the MongoDB environment, understand every env var, deploy |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | understand how pages, components, APIs and data fit together; what renders on the server |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | build UI that matches the site: tokens, fonts, buttons, cards, motion, hover rules |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | run the atelier day to day: orders, catalogue overrides, promo codes, staff |
| [BROWSER_SUPPORT.md](./BROWSER_SUPPORT.md) | know which browsers are supported, what fallbacks exist, how to test them |
| [TESTING.md](./TESTING.md) | verify a change: type-check, SSR smoke test, end-to-end checklist, contrast audit |
| [db-schema.md](./db-schema.md) | look up collection shapes and indexes |
| [atelier-catalog-progress.md](./atelier-catalog-progress.md) | see the state of the Atelier catalogue data work |

## Five-minute onboarding

```bash
npm install --legacy-peer-deps
npm run setup          # writes .env (local MongoDB, generated owner password - shown once)
npm run db:up          # starts MongoDB in Docker   (skip if you use Atlas)
npm run db:bootstrap   # collections + indexes + owner admin
npm run dev            # http://localhost:3000   admin: /admin
```

## Ground rules

1. **Tokens, not hex.** Use `bg-ink`, `text-cocoa`, `border-line`, `shadow-soft`, `.btn`, `.card` ... never a raw `#hex` in a class.
2. **Server-safe by default.** Components that can render on the server must not touch `window`, `document`, `Math.random()` or `Date.now()` during render (see ARCHITECTURE.md).
3. **Motion is transform/opacity only,** gated by `(hover: hover)` for hovers and silenced by `prefers-reduced-motion`.
4. **Every change ends with** `npx tsc --noEmit`, `npm run build`, and `npm run check:ssr` (see TESTING.md).
