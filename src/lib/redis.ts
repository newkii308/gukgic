import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isRedisConnected = false;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 100, 2000);
      },
      lazyConnect: true,
    });

    client.on('connect', () => {
      isRedisConnected = true;
    });

    client.on('error', () => {
      isRedisConnected = false;
    });

    client.connect().catch(() => {
      isRedisConnected = false;
    });

    redisClient = client;
    return redisClient;
  } catch {
    isRedisConnected = false;
    return null;
  }
}

export const redis = getRedisClient();

/**
 * Redis-backed Sliding Window Rate Limiter
 */
export async function checkRateLimitRedis(
  key: string,
  limit: number,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const client = getRedisClient();
  if (!client || !isRedisConnected) {
    // Fallback: allow request if Redis is unavailable in local dev
    return { success: true, remaining: limit - 1 };
  }

  try {
    const redisKey = `ratelimit:${key}`;
    const now = Date.now();
    const clearBefore = now - windowSeconds * 1000;

    const multi = client.multi();
    multi.zremrangebyscore(redisKey, 0, clearBefore);
    multi.zadd(redisKey, now, `${now}-${Math.random()}`);
    multi.zcard(redisKey);
    multi.expire(redisKey, windowSeconds);

    const results = await multi.exec();
    const count = (results?.[2]?.[1] as number) || 1;

    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch {
    return { success: true, remaining: limit - 1 };
  }
}

/**
 * Redis-backed Online Presence Tracking
 */
export const Presence = {
  async setOnline(userId: string, socketId: string): Promise<void> {
    const client = getRedisClient();
    if (!client || !isRedisConnected) return;
    try {
      await client.sadd(`presence:user:${userId}`, socketId);
      await client.sadd('presence:online_users', userId);
      await client.set(`presence:socket:${socketId}`, userId, 'EX', 86400);
    } catch {}
  },

  async setOffline(socketId: string): Promise<string | null> {
    const client = getRedisClient();
    if (!client || !isRedisConnected) return null;
    try {
      const userId = await client.get(`presence:socket:${socketId}`);
      if (userId) {
        await client.srem(`presence:user:${userId}`, socketId);
        const remainingSockets = await client.scard(`presence:user:${userId}`);
        if (remainingSockets === 0) {
          await client.srem('presence:online_users', userId);
        }
        await client.del(`presence:socket:${socketId}`);
        return userId;
      }
      return null;
    } catch {
      return null;
    }
  },

  async isOnline(userId: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client || !isRedisConnected) return true;
    try {
      const count = await client.scard(`presence:user:${userId}`);
      return count > 0;
    } catch {
      return true;
    }
  },

  async getOnlineUsers(): Promise<string[]> {
    const client = getRedisClient();
    if (!client || !isRedisConnected) return [];
    try {
      return await client.smembers('presence:online_users');
    } catch {
      return [];
    }
  },
};
