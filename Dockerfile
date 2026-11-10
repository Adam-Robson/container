# syntax=docker/dockerfile:1

# Stages:
#   dev    Vite dev server with hot reload (used by the `dev` compose service)
#   final  nginx serving the production build (default target)

FROM node:26-alpine AS base
WORKDIR /app

# Install dependencies in their own layer so source edits don't invalidate it.
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM deps AS build
COPY . .
RUN npm run build

# The app is static files once built, so no Node runtime ships in the image.
FROM nginxinc/nginx-unprivileged:stable-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
