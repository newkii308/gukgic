import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const ads = await db.getAds();
    return NextResponse.json({ ads });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}
