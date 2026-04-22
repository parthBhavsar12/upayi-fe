# UPayI

Production-oriented React starter built with Vite, TypeScript, ESLint, and Prettier.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` type-checks and creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks TypeScript and React lint rules.
- `npm run format` checks formatting.

## Environment

Vite loads mode-specific files automatically:

- `.env.development` is used by `npm run dev`.
- `.env.production` is used by `npm run build`.
- `.env.local` can override values locally and is ignored by git.

Required app variables:

- `VITE_PAYEE_NAME`
- `VITE_PAYEE_UPI_ID`
- `VITE_UPI_CURRENCY`
- `VITE_UPI_CURRENCY_SYMBOL`
- `VITE_UPI_PAYMENT_NOTE`
- `VITE_ALLOWED_HOSTS`

Copy `.env.example` to `.env.local` when you need machine-specific overrides.

All app code should read environment values from `src/config/env.ts`, not directly
from `import.meta.env`. This keeps validation and defaults in one place.

Do not put secrets in `VITE_*` variables. Vite embeds those values into the browser
bundle, so they are public. Store real secrets in a backend environment, deployment
platform secret manager, or GitHub Actions secrets.

`VITE_ALLOWED_HOSTS` is used by `vite.config.ts` for dev/preview host allow-listing.
The development value includes ngrok host suffixes so a local tunnel can reach Vite.
