import { createClient, type RedisClientType } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const url = process.env.REDIS_URL;

let _redis: RedisClientType | null = null;

export function getRedis(): RedisClientType {
  if (!_redis) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }

  return _redis;
}

export async function connectRedis(): Promise<void> {
  if (_redis?.isOpen) {
    return;
  }

  _redis = createClient({ url }) as RedisClientType;

  _redis.on("error", (err: Error) => {
    console.error("Redis Error:", err);
  });

  await _redis.connect();
}

export async function disconnectRedis(): Promise<void> {
  if (_redis?.isOpen) {
    await _redis.disconnect();
    _redis = null;
  }
}

export { _redis as redis };
