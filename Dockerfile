# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=24.18.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing all dependencies needed to build the app.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

################################################################################
# Create a stage for building the static production assets.
FROM deps AS build

# Copy the rest of the source files into the image.
COPY . .
# Build args are inlined into the JS bundle at build time by Vite, so
# Firebase config must be supplied at image build time, not at container run time.
# These values are not secrets - Firebase's client config is meant to be
# public; access is controlled by Firebase Security Rules, not by hiding
# this config. (Docker's build linter flags ARG/ENV for any *_KEY-shaped
# name, which is why this triggers a SecretsUsedInArgOrEnv warning.)
ARG VITE_APP_FIREBASE_API_KEY
ARG VITE_APP_FIREBASE_AUTH_DOMAIN
ARG VITE_APP_FIREBASE_PROJECT_ID
ARG VITE_APP_FIREBASE_STORAGE_BUCKET
ARG VITE_APP_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_APP_FIREBASE_APP_ID
ARG VITE_APP_FIREBASE_MEASUREMENT_ID
RUN npm run build

################################################################################
# Serve the built static assets with nginx. The app is a static SPA once
# built, so it does not need Node (or any devDependencies like vite) at
# runtime - `vite preview` is a dev-only tool and is not meant for production.
FROM nginx:1.29-alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
