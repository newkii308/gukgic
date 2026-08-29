import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional().default('3000'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters in production').optional(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration for production.');
    }
  }
  return parsed.data;
}

export const env = validateEnv();
