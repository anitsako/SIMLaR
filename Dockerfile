# Dependencies stage
FROM node:24.14.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM node:24.14.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM node:24.14.0-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
RUN mkdir -p /app/files
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
