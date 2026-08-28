import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const users = await db.getUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
