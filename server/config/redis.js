import { createClient } from "redis";
import env from "./env.js";

const memoryCache = new Map();

export const redisClient = env.REDIS_URL
  ? createClient({
    url: env.REDIS_URL,
  })
  : null;

if (redisClient) {
  redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
  });
}

export async function connectRedis() {
  if (!redisClient || redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
    console.log("Redis cache connected.");
  } catch (error) {
    console.error("Redis connection failed, falling back to in-memory cache:", error);
  }
}

export async function getCachedValue(key) {
  if (redisClient?.isOpen) {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  const memoryEntry = memoryCache.get(key);
  if (!memoryEntry) {
    return null;
  }

  if (memoryEntry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return memoryEntry.value;
}

export async function setCachedValue(key, value, ttlSeconds = env.REDIS_TTL_SECONDS) {
  if (redisClient?.isOpen) {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
    return;
  }

  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}
