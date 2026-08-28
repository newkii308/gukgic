============================================================
SOCIAL APP INFORMATION ARCHITECTURE
============================================================

GUKGIC เป็น Social Web Application

ต้องแยก User-facing Application ออกจาก
Admin / Moderation / Advertising Management อย่างชัดเจน

ห้ามนำ Admin controls หรือ Moderation controls
มาปะปนกับ User App

============================================================
USER APP
============================================================

โครงสร้างหลักของ User App:

User App
├── Home
├── Friends
├── Messages
├── Notifications
└── Profile
       └── Settings

นี่คือ Navigation หลักของผู้ใช้ทั่วไป

ห้ามเพิ่มเมนูหลักจำนวนมากจน Navigation รก

============================================================
HOME
============================================================

Home เป็นหน้า Feed หลัก

ควรรองรับ:

- Social Feed
- Create Post
- Posts
- Images
- Likes
- Comments
- Share
- Sponsored Ads
- Recommended content
- Refresh
- Infinite scroll / pagination

บน Mobile:

Bottom Navigation:

Home
Friends
Messages
Notifications
Profile

บน Desktop:

ใช้ Sidebar หรือ Navigation ที่เหมาะสม

อย่าบังคับใช้ Mobile Bottom Navigation
บน Desktop

============================================================
FRIENDS
============================================================

หน้า Friends เป็นศูนย์รวมระบบเพื่อน

รองรับ:

- Friend Requests
- Incoming Requests
- Sent Requests
- Friends List
- Search People
- Friend Suggestions
- Mutual Friends
- Blocked Users

ไม่ควรสร้างเมนูหลักแยก:

/requests
/suggestions
/blocked

จนทำให้ Navigation หลักรก

ให้รวมอยู่ภายใต้ Friends

============================================================
MESSAGES
============================================================

Messages เป็นศูนย์รวม Chat

รองรับ:

- Conversations
- Direct Messages
- Group Conversations ในอนาคต
- Text
- Emoji
- Images
- Voice Messages
- Typing Indicator
- Online Status
- Read Status
- Unread Count

ไม่ควรสร้าง:

/chat
/voice
/inbox

เป็น Navigation หลักแยกกัน

ให้ Messages เป็นศูนย์กลาง

============================================================
NOTIFICATIONS
============================================================

Notifications เป็นศูนย์รวมแจ้งเตือนทั้งหมด

เช่น:

- Friend Request
- Friend Accepted
- New Message
- Like
- Comment
- Mention
- System Notification

รองรับ:

- Read
- Unread
- Mark as read
- Mark all as read

Notifications ไม่ควรเป็นส่วนหนึ่งของ Settings

ต้องเป็น Navigation หลัก

============================================================
PROFILE
============================================================

Profile เป็นศูนย์กลางของ Account

รองรับ:

- Avatar
- Cover
- Display Name
- Username
- Bio
- Interests
- Languages
- Friends
- Posts
- Edit Profile

และมี:

Profile
└── Settings

============================================================
PROFILE → SETTINGS
============================================================

Settings เป็นพื้นที่สำหรับ Account และ Preferences

แบ่งหมวดอย่างเป็นระบบ:

Account
├── Edit Profile
├── Change Password
├── Email / Phone
└── Delete Account

Privacy
├── Profile Visibility
├── Post Visibility
├── Who Can Send Friend Requests
└── Blocked Users

Notifications
├── Push Notifications
├── Message Notifications
└── Social Notifications

Appearance
├── Light
├── Dark
└── System

Language
├── Lao
├── English
├── Thai
├── Chinese
└── Vietnamese

Security
├── Active Sessions
├── Logout Other Devices
└── Security Information

About
├── Terms
├── Privacy Policy
├── Community Guidelines
└── App Version

อย่าทำ Settings เป็นหน้าเดียวที่ยาวมาก

ใช้หมวดหมู่และ nested settings ที่เข้าใจง่าย

============================================================
MOBILE NAVIGATION
============================================================

Mobile Web ต้องมี Navigation ที่ใช้งานง่าย:

┌──────────────────────────────┐
│                              │
│          CONTENT             │
│                              │
├──────────────────────────────┤
│ Home Friends Messages Notif Profile │
└──────────────────────────────┘

ใช้ icon + label ที่เข้าใจง่าย

แสดง unread badge สำหรับ:

Messages
Notifications
Friend Requests

อย่าใส่ Settings ใน Bottom Navigation

อย่าใส่ Search เป็น Navigation หลัก
ถ้า Search สามารถเข้าถึงจาก Home/Friends ได้

============================================================
DESKTOP NAVIGATION
============================================================

Desktop สามารถใช้ Sidebar:

GUKGIC
────────────

Home
Friends
Messages
Notifications

────────────

Profile

Settings

ไม่จำเป็นต้องแสดงทุกอย่างใน Sidebar หากทำให้รก

============================================================
USER PROFILE MENU
============================================================

เมื่อกด Profile:

Profile
├── View Profile
├── Edit Profile
├── Friends
├── Settings
└── Logout

ไม่ควรเอา:

Admin
Moderation
Ad Management

มาแสดงตรงนี้

============================================================
ADMIN APP
============================================================

Admin ต้องเป็นพื้นที่แยกจาก User App

ตัวอย่าง:

/admin

หรือ architecture ที่เหมาะสม

Admin Dashboard
├── Overview
├── Users
├── Content
├── Reports
├── Moderation
├── Advertisements
├── Analytics
└── System

Normal users ต้องไม่สามารถเข้าถึง Admin UI/API

ต้องตรวจ authorization ฝั่ง server

============================================================
MODERATION
============================================================

Moderation ต้องแยกจาก User App

/admin/moderation

หรือ:

/moderation

โดยต้องมี role/permission protection

รองรับ:

Reports
├── Users
├── Posts
├── Comments
└── Messages

Moderation actions:

- Review
- Hide
- Remove
- Warn
- Suspend
- Ban
- Resolve
- Dismiss

ทุก action ต้องมี audit log

============================================================
ADVERTISEMENT MANAGEMENT
============================================================

User-facing Ads:

อยู่ใน Feed

แสดงเป็น:

Sponsored / ໂຄສະນາ

แต่การจัดการ Ads ต้องอยู่ Admin/Advertiser area

เช่น:

/admin/ads

ไม่ควรมี:

Ads Management
Campaign Management
Ad Analytics

อยู่ใน User Navigation

============================================================
SEARCH
============================================================

Search ไม่จำเป็นต้องเป็น Main Navigation

ให้เข้าถึงได้จาก:

Home
Friends

Search รองรับ:

Users
Username
Display Name
Interests

ในอนาคตสามารถขยายเป็น:

Posts
Hashtags
Communities

ได้

============================================================
RESPONSIVE RULE
============================================================

ห้ามออกแบบ Desktop ก่อนแล้วค่อยบีบเป็น Mobile

ต้องออกแบบ:

Mobile-first

แต่ต้องรองรับ:

Mobile
Tablet
Desktop

Layout สามารถเปลี่ยนตาม breakpoint

แต่ Information Architecture ต้องสอดคล้องกัน

============================================================
NAVIGATION PRINCIPLE
============================================================

Main Navigation ต้องสั้นและจำง่าย

เป้าหมาย:

Home
Friends
Messages
Notifications
Profile

ไม่ควรกลายเป็น:

Home
Feed
Explore
Friends
Requests
Messages
Voice
Notifications
Groups
Marketplace
Ads
Settings
Profile
...

หาก feature ใหม่เกิดขึ้น:

ให้พิจารณาก่อนว่า
ควรอยู่ภายใต้ feature เดิมหรือไม่

ตัวอย่าง:

Friend Requests
→ Friends

Voice Messages
→ Messages

Blocked Users
→ Friends / Settings

Appearance
→ Settings

Language
→ Settings

Ads Management
→ Admin

Moderation
→ Admin

Analytics
→ Admin

============================================================
ROUTING PRINCIPLE
============================================================

Route สามารถมีหลายหน้าได้

แต่ Main Navigation ต้องไม่จำเป็นต้องมีทุก route

ตัวอย่าง:

/home
/friends
/friends/requests
/friends/suggestions
/messages
/messages/[conversationId]
/notifications
/profile/[username]
/settings
/settings/privacy
/settings/security

สิ่งเหล่านี้สามารถมี nested navigation
โดยไม่เพิ่ม Main Navigation

============================================================
AUTHENTICATION BOUNDARY
============================================================

Public:

/
 /about
 /u/[username]
 /terms
 /privacy

Authenticated:

/home
/friends
/messages
/notifications
/profile
/settings

Admin:

/admin/*

Moderation:

/admin/moderation/*

ถ้า unauthenticated user เข้า protected route:

→ redirect ไป Login

ถ้า normal user เข้า Admin:

→ 403 Forbidden หรือ redirect ที่เหมาะสม

ห้ามใช้ frontend-only protection

ต้องป้องกัน server/API ด้วย

============================================================
FINAL UX GOAL
============================================================

GUKGIC ต้องให้ความรู้สึกเหมือน
Social App ทั่วไปที่ผู้ใช้เปิดแล้วเข้าใจทันที

ไม่ต้องเรียนรู้ระบบใหม่

Main navigation:

Home
Friends
Messages
Notifications
Profile

ทุก feature อื่นต้องจัดอยู่ภายใต้หมวดที่เหมาะสม

ห้ามเพิ่ม Navigation เพียงเพราะมี feature ใหม่

เน้น:

Simple
Clean
Modern
Fast
Familiar
Mobile-first
Responsive
Accessible

อย่าให้ UI รก
============================================================