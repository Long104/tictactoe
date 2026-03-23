FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

RUN bun install --frozen-lockfile

COPY src/ ./src/

RUN bun build src/index.ts --outdir dist --minify

FROM oven/bun:1.1-alpine

WORKDIR /app

RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

COPY --from=builder /app/dist ./dist
COPY package.json ./

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["bun", "run", "dist/index.js"]