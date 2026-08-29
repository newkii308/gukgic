import { checkRateLimitRedis } from '@/lib/redis';

interface RateLimitOptions {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new Map<string, { count: number; expiresAt: number }>();

  return {
    check: (limit: number, token: string): { success: boolean; remaining: number } => {
      const now = Date.now();
      const record = tokenCache.get(token);

      // Clean up cache if it grows too large
      if (tokenCache.size > options.uniqueTokenPerInterval) {
        const keysToDelete: string[] = [];
        Array.from(tokenCache.entries()).forEach(([key, val]) => {
          if (val.expiresAt < now) keysToDelete.push(key);
        });
        keysToDelete.forEach((k) => tokenCache.delete(k));
      }

      if (!record || record.expiresAt < now) {
        tokenCache.set(token, { count: 1, expiresAt: now + options.interval });
        return { success: true, remaining: limit - 1 };
      }

      if (record.count >= limit) {
        return { success: false, remaining: 0 };
      }

      record.count += 1;
      return { success: true, remaining: limit - record.count };
    },

    checkAsync: async (limit: number, token: string): Promise<{ success: boolean; remaining: number }> => {
      const redisRes = await checkRateLimitRedis(token, limit, Math.ceil(options.interval / 1000));
      return redisRes;
    },
  };
}

// Pre-configured limiters for different endpoints
export const authLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 }); // 30 attempts / min
export const apiLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 2000 }); // 60 requests / min
export const uploadLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 }); // 15 uploads / min
