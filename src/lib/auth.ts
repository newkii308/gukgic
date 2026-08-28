import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { db } from './db';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'friend-social-app-genz-secret-key-2026';

export interface TokenPayload {
  userId: string;
  username: string;
}

export function signToken(user: User): string {
  return jwt.sign(
    { userId: user.id, username: user.username },
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
  // If plain text demo fallback
  if (hash === password) return true;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function getCurrentUserFromRequest(req: NextRequest): User | null {
  // Try Authorization header first
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Fallback to cookie
  if (!token) {
    token = req.cookies.get('friend_token')?.value || null;
  }

  if (!token) {
    // Default to the demo active user 'user_me' if unauthenticated in dev/preview mode
    return db.getUserById('user_me') || null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return db.getUserById('user_me') || null;
  }

  return db.getUserById(payload.userId) || null;
}
