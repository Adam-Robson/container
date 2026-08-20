# container

A browser-based workspace for writing JavaScript and TypeScript and downloading
the result as a ready-to-run project.

Built with Vite, React 18, TypeScript, React Router, and Firebase Auth.
Linting and formatting are handled by Biome; tests run on Vitest.

## Getting started

```bash
npm install
cp .env.example .env   # fill in from your Firebase console
npm run dev
```

The app throws on startup with a list of missing keys if `.env` is incomplete,
rather than failing later with an opaque Firebase error.

### Firebase setup

Create a web app under **Project settings → General → Your apps** and copy the
SDK config values into `.env`. Under **Authentication → Sign-in method**, enable
the providers the app uses: **Google**, **GitHub**, and **Anonymous** (anonymous
sign-in backs the "Continue as guest" flow).

These `VITE_APP_*` values are compiled into the client bundle and are not
secrets. Firebase access is controlled by Auth settings and Security Rules.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (`--host`, so it is reachable on your LAN) |
| `npm run build` | Typecheck, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc -b` with no emit |
| `npm run lint` | Biome check |
| `npm run lint:fix` | Biome check with fixes applied |
| `npm run test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |

## Layout

```
src/
  components/   Shared UI (AuthMenu)
  contexts/     AuthProvider — the app's auth boundary
  hooks/        useLocalStorage
  lib/          Shared type declarations
  middleware/   Reducer dispatch middleware
  pages/        Route components (Home, Editor, NotFound)
  reducer/      Reducers and the logging wrapper
  routes/       Router configuration
  services/     Firebase init and auth calls
  tests/        Vitest setup and specs
```

`@/*` is aliased to `src/*` in both `tsconfig.app.json` and `vite.config.ts`.

## Adding the editor

`src/pages/Editor.tsx` is the mount point. It is loaded through `React.lazy` in
`src/routes/router.tsx`, so the editor bundle stays out of the initial page
load. `.editor__surface` is a sized grid child with a resolved height, which is
what Monaco requires — it measures its container on mount and collapses to zero
height inside an auto-height parent.

## Docker

See [README.Docker.md](README.Docker.md).
