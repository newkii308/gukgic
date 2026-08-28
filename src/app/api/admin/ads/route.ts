import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  const ads = db.getAllAds();
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  const auth = requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { title, sponsor, description, imageUrl, ctaText, targetUrl, badge, isActive } = body;

    if (!title || !sponsor || !description || !targetUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAd = db.createAd({
      title,
      sponsor,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      ctaText: ctaText || 'View Offer',
      targetUrl,
      badge: badge || 'Sponsored',
      isActive: isActive !== undefined ? isActive : true,
    });

    db.addAuditLog({
      adminId: auth.user.id,
      adminName: auth.user.name,
      action: 'CREATE_ADVERTISEMENT',
      targetType: 'AD',
      targetId: newAd.id,
      details: `Created new ad campaign "${title}" by ${sponsor}`,
    });

    return NextResponse.json({ ad: newAd }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
