import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProfileHeader } from '@/components/profile/profile-header';
import { PostCard } from '@/components/feed/post-card';
import { Post } from '@/types';

interface PublicProfileProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PublicProfileProps): Promise<Metadata> {
  const user = db.getUserByUsername(params.username);
  if (!user) {
    return {
      title: 'User Not Found | Friend Social',
    };
  }

  const title = `${user.name} (@${user.username}) | Friend Social Laos`;
  const description = user.bio || `Connect with ${user.name} on Friend Social Laos. Interests: ${user.interests.join(', ')}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://friend-social.la/u/${user.username}`,
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
    alternates: {
      canonical: `https://friend-social.la/u/${user.username}`,
    },
  };
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const user = db.getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  const userPosts = db.getPosts().filter((p: Post) => p.userId === user.id);
  const status = db.getFriendshipStatus('user_me', user.id);

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
        isOwnProfile={user.id === 'user_me'}
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
            No public posts shared yet.
          </div>
        )}
      </div>
    </div>
  );
}
