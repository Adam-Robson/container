# container

A containerized starter for single-page apps: Vite, React 19, TypeScript, and
React Router, with Biome for linting and formatting, Vitest for tests, and a
Docker setup for both development and production.

## Using this template

1. Click **Use this template** on GitHub (or clone the repo).
2. Rename the project:
   - `name` in `package.json`
   - `<title>` and description in `index.html`
   - the brand text in `src/App.tsx` and heading in `src/pages/Home.tsx`
   - `public/favicon.svg`
   - the copyright holder in `LICENSE`
3. Start building in `src/pages/Home.tsx`.

## Running with Docker

No local Node install is needed.

| Command                                       | What it runs                     | URL                     |
| --------------------------------------------- | -------------------------------- | ----------------------- |
| `docker compose up --build`                   | Production build served by nginx | <http://localhost:8080> |
| `docker compose --profile dev up --build dev` | Vite dev server with hot reload  | <http://localhost:5173> |

The dev service mounts the project directory into the container, so edits on
the host reload in the browser. After changing dependencies, rebuild it with
`docker compose --profile dev up --build --renew-anon-volumes dev` so the
container picks up the new `node_modules`.

The production image is a multi-stage build: Node compiles the app, then an
unprivileged nginx image serves the static files on port 8080. `nginx.conf`
falls back to `index.html` for unknown paths so client-side routes survive a
page refresh.

To build for a different CPU architecture than your machine (for example,
deploying to amd64 from an Apple Silicon Mac):

```bash
docker build --platform=linux/amd64 -t myapp .
```

## Running without Docker

Requires the Node version listed under `engines` in `package.json`.

```bash
npm install
npm run dev
```

| Script               | What it does                                               |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Vite dev server (`--host`, so it is reachable on your LAN) |
| `npm run build`      | Typecheck, then build to `dist/`                           |
| `npm run preview`    | Serve the production build locally                         |
| `npm run typecheck`  | `tsc -b` with no emit                                      |
| `npm run lint`       | Biome check                                                |
| `npm run lint:fix`   | Biome check with fixes applied                             |
| `npm run test`       | Vitest, single run                                         |
| `npm run test:watch` | Vitest in watch mode                                       |

## Layout

```text
src/
  pages/        Route components (Home, NotFound)
  routes/       Route table
  tests/        Vitest setup and specs
  App.tsx       Shell: header and route outlet
  index.css     Design tokens, reset, and base styles
Dockerfile      dev and production stages
compose.yaml    web (production) and dev services
nginx.conf      Static file serving and SPA fallback
```

`@/*` is aliased to `src/*` in both `tsconfig.app.json` and `vite.config.ts`.

## Environment variables

Vite exposes variables prefixed with `VITE_` to client code and compiles them
into the bundle at build time, so they are not secrets. `.env` files are
excluded from the Docker build context; pass build-time values with
`--build-arg` and a matching `ARG` in the `build` stage of the `Dockerfile`.

## CI

- **Continuous Integration** — lint, build, and test on Node 22 and 24.
- **Docker Image CI** — builds both image targets, starts the production
  container, and checks the index page and the SPA fallback.
- **Dependabot** — weekly updates for npm, GitHub Actions, and Docker base
  images.

## License

[MIT](LICENSE)
