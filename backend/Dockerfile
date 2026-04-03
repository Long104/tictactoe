FROM oven/bun:1.3.4

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 10000

CMD ["bun", "run", "dist/index.js"]
