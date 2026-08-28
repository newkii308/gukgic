# 🇱🇦 Friend Social App (Web + Capacitor Mobile Ready)

> **ພື້ນທີ່ຫາເພື່ອນໃໝ່ຂອງຄົນຮຸ່ນໃໝ່ໃນລາວ — The Friend-Finding Social App for Lao Gen Z**

A production-ready, high-performance social web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Socket.IO Real-time WebSockets**, structured to seamlessly build into native **Android** & **iOS** apps via **Capacitor**.

---

## ✨ Key Features & Architecture

### 1. 💬 Real-Time Chat & Voice Messaging
- **WebSocket Engine:** Real-time bi-directional messaging with Socket.IO.
- **Voice Messages (ສຽງຂໍ້ຄວາມ):** Native-friendly audio recording with live waveform simulation, progress seeking, and duration counter `(▶ ━━━━━━━ 0:12)`.
- **Chat Experience:** Read receipts (`✓✓`), typing indicators, reply quote snippets, and unsend/delete actions.
- **Future-Ready Call Architecture:** Modular abstractions ready for WebRTC Voice/Video call integration.

### 2. 🇱🇦 Natural Lao Localization (i18n)
- **Primary Language:** Authentic, natural, conversational Lao tailored for Gen Z (not rigid bureaucratic/machine-translated text).
- **Multi-language Support:**
  - 🇱🇦 **ລາວ (Lao)** — Primary
  - 🇺🇸 **English**
  - 🇹🇭 **ไทย (Thai)**
  - 🇨🇳 **中文 (Chinese)**
  - 🇻🇳 **Tiếng Việt**
- Zero-layout shift parameter interpolation (`{{name}}`, `{{count}}`, `{{time}}`).

### 3. 🎨 Gen Z Aesthetics & Theme System
- **3 Modes:** Light, Dark, System (`prefers-color-scheme`).
- **Typography:** Custom typography stack with `Noto Sans Lao`, `Plus Jakarta Sans`, and Unicode glyph protection.
- **Clean Whitespace & Micro-Interactions:** Subtle heart bounce on like, smooth tab transitions, and thumb-friendly bottom navigation.

### 4. 👥 Friend Discovery & Social Feed
- **Dynamic Friendship System:** Status-aware buttons (`Add Friend`, `Requested`, `Accept`, `Decline`, `Message`).
- **Community Discovery:** Filter potential friends by City (Vientiane, Luang Prabang, Champasak, Savannakhet) and Interests (Photography, Coffee, Gaming, Tech, Music, Camping).
- **Feed Stream:** Interleaved user posts, friend recommendation widgets, and `<AdCard />` components clearly labeled with `"ໂຄສະນາ"` / `"Sponsored"`.

### 5. 📱 PWA & Capacitor Native Abstraction Layer
- Built-in device wrappers in `@/lib/capacitor`:
  - `NativeCamera`: Photo selection and capture.
  - `NativeMicrophone`: Audio stream permission and capture.
  - `NativePush`: Push notification registration.
  - `NativeShare`: System share sheet integration with clipboard fallback.
  - `NativeStorage`: Persistent local preferences.

### 6. 🚀 SEO & Web Standards
- Dynamic Open Graph and Twitter card generation for public user profiles (`/u/[username]`).
- Schema.org JSON-LD Structured Data (`Person` schema).
- Built-in `robots.txt` and `sitemap.xml` separating public profiles from private chat rooms.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                     # REST API Endpoints
│   │   ├── auth/                # Login, Register, Session, Logout
│   │   ├── users/               # User profiles and status
│   │   ├── friends/             # Add, Accept, Reject, Cancel, Discover
│   │   ├── posts/               # Feed posts, Likes, Comments
│   │   ├── conversations/       # Chat threads & Messages
│   │   ├── notifications/       # User notification center
│   │   ├── moderation/          # Report & Block system
│   │   └── search/              # Global live search
│   ├── friends/                 # Find Friends & Requests Hub
│   ├── messages/                # Inbox & Direct Chat Rooms
│   ├── notifications/           # Notification Alerts
│   ├── profile/                 # Own Profile Editor
│   ├── u/[username]/            # Public SEO Profiles
│   ├── settings/                # Themes, Languages, Device controls
│   ├── layout.tsx               # Root Layout & Providers
│   ├── page.tsx                 # Home Social Feed
│   ├── robots.ts                # SEO Robots rules
│   └── sitemap.ts               # Dynamic sitemap
├── components/
│   ├── ui/                      # Button, Avatar, Input, Badge, Modal, Skeleton
│   ├── layout/                  # Header, MobileNav, DesktopSidebar, AppShell
│   ├── feed/                    # PostCard, CreatePost, FeedSuggestions, StoriesBar
│   ├── friends/                 # FriendCard, FriendRequestCard, DiscoverSection
│   ├── chat/                    # ChatWindow, MessageBubble, VoicePlayer, VoiceRecorder
│   ├── profile/                 # ProfileHeader, ProfileEditModal
│   └── ads/                     # AdCard (Sponsored component)
├── hooks/                       # useI18n, useTheme, useAuth, useSocket, useVoiceRecorder
├── i18n/                        # lo.json, en.json, th.json, zh.json, vi.json
├── lib/
│   ├── db.ts                    # High-speed data engine & seed profiles
│   ├── auth.ts                  # JWT & password hashing
│   ├── capacitor/               # Native device abstraction layer
│   └── utils.ts                 # Timeago and formatting utilities
└── types/                       # Core TypeScript interfaces
server.js                        # Integrated Socket.IO WebSocket Server
```

---

## ⚡ Quick Start

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm start
```

### 3. Deploy to Railway
1. Connect your repository to Railway.
2. Railway will automatically detect Node.js and run `npm run build` and `npm start`.
3. Set environment variables:
   - `JWT_SECRET` (optional, has built-in secure fallback)
   - `PORT=3000`

---

## 📱 Future Capacitor Build (Android / iOS)

To package into Native Apps:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Friend Social" "com.friendsocial.la"
npx cap add android
npx cap add ios
npm run build
npx cap sync
npx cap open android
```
