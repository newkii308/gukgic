import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { ProfileHeader } from '@/components/profile/profile-header';
import { PostCard } from '@/components/feed/post-card';

interface PublicProfileProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PublicProfileProps): Promise<Metadata> {
  const user = await db.getUserByUsername(params.username);
  if (!user) {
    return {
      title: 'User Not Found | GUKGIC',
    };
  }

  const title = `${user.name} (@${user.username}) | GUKGIC Social`;
  const description = user.bio || `Connect with ${user.name} on GUKGIC Social Laos. Interests: ${user.interests.join(', ')}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://gukgic.la/u/${user.username}`,
      images: [
        {
          url: user.avatar,
          width: 400,
          height: 400,
          alt: user.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [user.avatar],
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const user = await db.getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  // Check current session from cookie header in server component
  const headersList = headers();
  const cookieHeader = headersList.get('cookie') || '';
  let currentUserId: string | undefined;

  const match = cookieHeader.match(new RegExp(`(?:^|; )${TOKEN_COOKIE_NAME}=([^;]*)`));
  if (match) {
    const payload = verifyToken(match[1]);
    if (payload) currentUserId = payload.userId;
  }

  const isOwnProfile = Boolean(currentUserId && currentUserId === user.id);
  const status = currentUserId ? await db.getFriendshipStatus(currentUserId, user.id) : 'none';
  const userPosts = await db.getPosts(currentUserId, { userId: user.id });

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.name,
    alternateName: `@${user.username}`,
    description: user.bio,
    image: user.avatar,
    address: {
      '@type': 'PostalAddress',
      addressLocality: user.city || user.location,
      addressCountry: 'LA',
    },
    knowsLanguage: user.languages,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        initialFriendshipStatus={status}
      />

      {/* User's Public Posts */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-800 dark:text-dark-text px-1">
          Posts by {user.name} ({userPosts.length})
        </h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="py-12 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-6 text-xs text-slate-400">
            ຍັງບໍ່ມີໂພສເທື່ອ (No posts shared yet)
          </div>
        )}
      </div>
    </div>
  );
}
