//TODO: use this when want to scale
import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
};

export const pubClient = new Redis({
  ...redisConfig,
  name: "pubClient",
});

export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  console.error("Redis pubClient error", err);
});

subClient.on("error", (err) => {
  console.error("Redis subClient error:", err);
});

process.on("SIGINT", async () => {
  await pubClient.quit();
  await subClient.quit();
  process.exit(0);
});

export { redisConfig };
