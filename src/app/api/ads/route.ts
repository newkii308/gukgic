import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const ads = db.getAds();
  return NextResponse.json({ ads });
}
