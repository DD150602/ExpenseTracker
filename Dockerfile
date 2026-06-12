FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile

# ─── Build Frontend ───────────────────────────────────────
FROM base AS frontend-build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY frontend/ ./frontend/
RUN pnpm --filter frontend build

# ─── Build backend ───────────────────────────────────────
FROM base AS backend-build
COPY backend/ ./backend/
RUN pnpm --filter backend build

FROM node:20-alpine AS final
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --filter backend --prod --frozen-lockfile

COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=backend-build /app/backend/dist ./backend/dist

EXPOSE 3000

CMD ["node", "backend/dist/index.js"]
