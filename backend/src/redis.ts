import Redis from "ioredis"

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost"
}
