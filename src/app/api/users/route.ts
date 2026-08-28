import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const users = db.getUsers();
  return NextResponse.json({ users });
}
