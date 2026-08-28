import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { profileUpdateSchema } from '@/lib/schemas';
import { UserSettings } from '@/types';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const currentSettings: UserSettings = user.settings || {
      profileVisibility: 'public',
      postVisibility: 'public',
      whoCanSendRequests: 'everyone',
      pushNotifications: true,
      messageNotifications: true,
      socialNotifications: true,
    };

    const newSettings: UserSettings | undefined = parsed.data.settings
      ? { ...currentSettings, ...parsed.data.settings }
      : undefined;

    // Only allow explicit allowlisted fields
    const updated = await db.updateUser(user.id, {
      name: parsed.data.name,
      bio: parsed.data.bio,
      location: parsed.data.location,
      city: parsed.data.city,
      avatar: parsed.data.avatar,
      coverImage: parsed.data.coverImage,
      languages: parsed.data.languages,
      interests: parsed.data.interests,
      settings: newSettings,
    });

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
