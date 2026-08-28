import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { User } from '@/types';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'gukgic-lao-social-jwt-secret-key-2026-genz';
export const TOKEN_COOKIE_NAME = 'gukgic_token';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getCurrentUserFromRequest(req: NextRequest): User | null {
  try {
    // 1. Try Bearer token in Authorization header
    const authHeader = req.headers.get('authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Try cookie
    if (!token) {
      token = req.cookies.get(TOKEN_COOKIE_NAME)?.value || req.cookies.get('friend_token')?.value;
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = db.getUserById(payload.userId);
    if (!user || user.isBanned) return null;

    return user;
  } catch {
    return null;
  }
}
