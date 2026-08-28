============================================================
GUKGIC — USER APP FIRST / REAL SYSTEM REBUILD
============================================================

IMPORTANT:

ตอนนี้ผมพอใจกับภาพรวม UI, Design Direction และรายการฟีเจอร์แล้ว

ปัญหาหลักของโปรเจกต์ตอนนี้ไม่ใช่ "ขาดหน้าสวย"
แต่คือ "ระบบการใช้งานจริงยังไม่สมบูรณ์"

ดังนั้น:

หยุดเพิ่ม feature ใหม่ที่ไม่จำเป็น
หยุดเน้น Admin Panel
หยุดเน้น Moderation Dashboard
หยุดเน้น Advertising Management

FOCUS 100% ON:

USER APP
+
USER EXPERIENCE
+
REAL FUNCTIONALITY
+
DATA FLOW
+
AUTHENTICATION
+
DATABASE
+
API
+
REALTIME
+
ERROR HANDLING

เป้าหมาย:

ทำให้ GUKGIC สามารถใช้งานในฐานะ Social Web App ได้จริง

ไม่ใช่แค่ Demo ที่หน้าตาเหมือน Social App

============================================================
PRODUCT PRIORITY
============================================================

Priority #1:

USER APP

Priority #2:

CORE SYSTEM

Priority #3:

DATA / BACKEND

Priority #4:

PERFORMANCE / SECURITY

Priority #5:

ADMIN / MODERATION

Admin และระบบหลังบ้านสามารถทำภายหลังได้

ห้ามใช้เวลาส่วนใหญ่กับ Admin ใน Phase นี้

============================================================
USER APP STRUCTURE
============================================================

ต้องยึดโครงสร้างนี้:

User App
├── Home
├── Friends
├── Messages
├── Notifications
└── Profile
       └── Settings

ห้ามเพิ่ม Main Navigation โดยไม่จำเป็น

============================================================
CURRENT PRODUCT DIRECTION
============================================================

ภาพรวม UI และ feature list เดิมสามารถรักษาไว้ได้

อย่ารื้อ UI ที่ดีโดยไม่มีเหตุผล

แต่ทุก feature ที่มีอยู่ต้องตรวจว่า:

UI
↓
Frontend state
↓
API
↓
Validation
↓
Business logic
↓
Database
↓
Response
↓
UI update

ทำงานครบหรือไม่

ถ้า UI มีปุ่มแต่ backend ยังไม่ทำจริง:

IMPLEMENT IT

ถ้า UI มีข้อมูล fake:

REMOVE MOCK DATA

ถ้า feature มีอยู่แต่ใช้งานไม่สมบูรณ์:

REPAIR IT

============================================================
PHASE 0 — FULL USER APP AUDIT
============================================================

ก่อนแก้:

ตรวจสอบ User App ทุกหน้า

ตรวจ:

/
Home
Friends
Messages
Notifications
Profile
Settings
Login
Register

รวมถึงทุก nested route

ตรวจทุกปุ่ม

ตรวจทุก form

ตรวจทุก interaction

ตรวจทุก API call

ตรวจ loading state

ตรวจ error state

ตรวจ empty state

ตรวจ responsive behavior

ตรวจ mobile layout

ตรวจ desktop layout

ห้ามดูเฉพาะ source structure

ต้องตรวจว่า user สามารถใช้งาน flow จริงได้หรือไม่

สร้าง audit report:

FEATURE
STATUS
CURRENT IMPLEMENTATION
MOCK / REAL
BUGS
MISSING BACKEND
MISSING DATABASE
UX PROBLEM
SECURITY PROBLEM
PRIORITY

============================================================
P0 — AUTHENTICATION
============================================================

ระบบ Login/Register ต้องเป็นของจริง

ต้องมี:

Register
Login
Logout
Session
Protected routes
Protected API
Password hashing
Session expiration

ห้ามมี:

user_me fallback
demo login
fake authentication
hardcoded password
password123
client-controlled user identity

Flow:

Register
↓
Validate
↓
Create PostgreSQL User
↓
Create Profile
↓
Create Session
↓
Set secure session cookie
↓
Redirect Home

Login:

Identifier
+
Password
↓
Validate
↓
Find User
↓
Verify Password
↓
Create Session
↓
Set Cookie
↓
Home

ไม่มี session:

Protected page
↓
Login

ไม่มี session:

Protected API
↓
401

============================================================
P1 — USER PROFILE
============================================================

Profile ต้องเป็นข้อมูลจริงจาก database

รองรับ:

View Profile
Edit Profile
Avatar
Cover
Display Name
Username
Bio
Languages
Interests

Profile update:

Frontend
↓
API
↓
Authentication
↓
Authorization
↓
Validation
↓
Database
↓
Response
↓
Update UI

ห้ามแก้ profile แล้วแค่เปลี่ยน React state

Refresh หน้าแล้วข้อมูลต้องยังอยู่

============================================================
P1 — FRIEND SYSTEM
============================================================

Friend system ต้องทำงานจริง

รองรับ:

Add Friend
Cancel Request
Accept
Reject
Remove Friend
Block
Unblock

States ต้องถูกต้อง:

NONE
REQUEST_SENT
REQUEST_RECEIVED
FRIENDS
BLOCKED

ห้ามเกิด:

duplicate request
duplicate friendship
self friendship
request หลัง block

ทุก state ต้อง persist database

Refresh แล้ว state ต้องไม่หาย

============================================================
P1 — HOME / FEED
============================================================

Home ต้องเป็น Feed จริง

รองรับ:

Create Post
Edit Post
Delete Post
Like
Unlike
Comment
Delete Comment
Post visibility

ข้อมูลต้องมาจาก PostgreSQL

ห้ามใช้:

INITIAL_POSTS
sample posts
hardcoded feed

ต้องมี:

pagination / cursor pagination

ไม่โหลดทั้ง database ใน request เดียว

หลังสร้าง post:

Database
↓
Response
↓
Feed update

ไม่ใช่แค่เพิ่ม object เข้า frontend state

============================================================
P1 — CHAT
============================================================

Messages ต้องเป็นระบบจริง

ต้องรองรับ:

Conversation
Messages
Send
Receive
Typing
Online status
Read status
Unread count

Architecture:

User
↓
Authenticated Session
↓
Socket authentication
↓
Conversation authorization
↓
Message validation
↓
PostgreSQL
↓
Socket emit
↓
Recipient

Database เป็น source of truth

Socket เป็น realtime delivery layer

ห้ามใช้ socket เป็น database

Refresh chat:

Messages ต้องยังอยู่

============================================================
P1 — VOICE MESSAGE
============================================================

Voice message ต้องเป็นของจริง

ไม่ใช้ sample_audio

Flow:

Microphone
↓
Record
↓
Validate
↓
Upload
↓
Storage
↓
Save metadata
↓
Create message
↓
Realtime update

ต้องรองรับ:

duration
file size
mime type

จำกัด file size / duration

============================================================
P1 — NOTIFICATIONS
============================================================

Notifications ต้องทำงานจริง

เช่น:

Friend Request
Friend Accepted
Like
Comment
New Message

ต้อง persist database

ต้องมี:

Unread
Read
Mark as read
Mark all as read

Badge ต้องตรงกับ database

Refresh แล้ว unread state ต้องถูกต้อง

============================================================
P1 — SEARCH
============================================================

Search ต้องค้นข้อมูลจริง

Users
Username
Display Name

ห้ามใช้ static result

Search ต้อง:

validate input
rate limit
pagination

============================================================
P1 — SETTINGS
============================================================

Settings ต้องใช้งานจริง

จัดเป็น:

Profile
Account
Privacy
Notifications
Appearance
Language
Security

รองรับ:

Light
Dark
System

Languages:

Lao
English
Thai
Chinese
Vietnamese

Preference ต้อง persist

Refresh แล้วไม่ reset

============================================================
P1 — BLOCK SYSTEM
============================================================

Block ต้องทำงานจริงทั้งระบบ

ถ้า A block B:

B ไม่ควรสามารถ:

ส่ง friend request
ส่ง message
ทำ interaction ที่ถูกจำกัด
เข้าถึงข้อมูลที่ควรถูกซ่อน

ต้อง enforce server-side

ไม่ใช่แค่ซ่อน UI

============================================================
P2 — MEDIA
============================================================

ตรวจระบบ:

Avatar
Cover
Post image
Chat image
Voice

ห้าม fake URL

สร้าง Storage abstraction

upload()
delete()
getUrl()

ตรวจ:

MIME
size
extension

ห้าม trust filename

============================================================
P2 — UX STATES
============================================================

ทุกหน้าและทุก action ต้องมี:

Loading
Skeleton
Empty
Error
Success
Retry

ตัวอย่าง:

ไม่มีเพื่อน

"ຍັງບໍ່ມີໝູ່ເທື່ອ"

ไม่มีข้อความ

"ຍັງບໍ່ມີຂໍ້ຄວາມ"

เกิด error:

แสดงข้อความที่เข้าใจง่าย

ห้ามแสดง:

500
SQL error
stack trace
raw exception

============================================================
P2 — OPTIMISTIC UI
============================================================

ใช้ optimistic update เฉพาะ action ที่เหมาะสม

เช่น:

Like
Unlike

Flow:

User click
↓
UI update immediately
↓
API
↓
Success
    → keep
Failure
    → rollback

ห้าม optimistic update
กับ operation ที่มีความเสี่ยงด้านข้อมูลสูง
โดยไม่มี rollback

============================================================
P2 — MOBILE UX
============================================================

Mobile-first

ต้องให้ความรู้สึกเหมือน Social App จริง

Main navigation:

Home
Friends
Messages
Notifications
Profile

Bottom navigation บน mobile

Settings อยู่ใน Profile

ไม่เพิ่มเมนูเกินจำเป็น

============================================================
P2 — DESKTOP UX
============================================================

Desktop:

Sidebar / top navigation
ตามความเหมาะสม

ไม่ต้องบังคับ mobile bottom navigation

Content width ต้องอ่านง่าย

Feed ไม่กว้างเกินไป

Chat layout ต้องเหมาะกับ desktop

============================================================
P2 — RESPONSIVE
============================================================

ตรวจ:

320px
375px
390px
414px
768px
1024px
1280px+
 
ห้ามมี:

horizontal overflow
text clipping
button overflow
broken modal
broken bottom navigation

============================================================
P2 — PERFORMANCE
============================================================

ตรวจ:

Next.js rendering
Server Components
Client Components
bundle size
image optimization
lazy loading
database queries
N+1
pagination

อย่าใช้ "use client"
กับทั้ง application โดยไม่จำเป็น

============================================================
P2 — API ARCHITECTURE
============================================================

ทุก API ต้องมี:

Authentication
Authorization
Validation
Business logic
Database operation
Error handling

ใช้ schema validation

แนะนำ:

Zod

ห้ามรับ:

userId
ownerId
role

จาก client แล้วเชื่อทันที

Identity ต้องมาจาก authenticated session

============================================================
P2 — DATABASE
============================================================

เปลี่ยน:

MemoryDB
db.json
hardcoded arrays

เป็น:

PostgreSQL

ORM:

Prisma หรือ Drizzle

เลือกหนึ่ง

ต้องมี:

migrations
indexes
foreign keys
unique constraints

============================================================
P2 — DATA CONSISTENCY
============================================================

ทุก operation ที่มีหลาย database writes
ให้พิจารณา transaction

เช่น:

Accept friend
↓
Friendship
↓
Request update
↓
Notification

ต้องไม่เกิดสถานะครึ่ง ๆ กลาง ๆ

============================================================
P2 — SECURITY
============================================================

ตรวจ:

Authentication
Authorization
CSRF
XSS
SQL injection
Rate limiting
File upload
Cookie security
CORS
Security headers
Session security

แต่ห้ามให้ Security work
กลายเป็นเหตุผลในการหยุด User App development

ทำ security ที่จำเป็นต่อ feature ก่อน

============================================================
P3 — ADMIN
============================================================

ADMIN ไม่ใช่ priority ตอนนี้

ห้ามใช้เวลาใน Phase นี้
ไปสร้าง Admin Dashboard ขนาดใหญ่

เตรียม architecture เท่าที่จำเป็น

เช่น:

role
permission
audit log foundation

แต่ UI/admin dashboard
สามารถทำใน Phase หลังจาก User App เสร็จ

============================================================
P3 — MODERATION
============================================================

ตอนนี้ทำเฉพาะ foundation ที่จำเป็น:

Report
Block
basic moderation status

ไม่ต้องสร้าง Dashboard ใหญ่

Admin moderation UI
ทำภายหลัง

============================================================
P3 — ADS
============================================================

User-facing Ads ยังสามารถแสดงใน Feed ได้

แต่ตอนนี้:

Focus:
Ad rendering
Sponsored label
Feed placement

ยังไม่ต้องสร้าง:

Billing dashboard
Advertiser portal
Advanced analytics
Campaign management UI

จนกว่า Core Social System จะเสร็จ

============================================================
CODE ORGANIZATION
============================================================

แยก:

components
features
hooks
services
lib
types
schemas

Backend:

routes
services
repositories
database
schemas
middleware

ห้ามเอา database logic
ไปกระจายอยู่ใน React components

ห้ามเอา business logic
ไว้ใน UI component

============================================================
REMOVE DEMO
============================================================

ค้นหาและกำจัด:

MemoryDB
db.json
INITIAL_USERS
INITIAL_POSTS
sample messages
sample voice
fake API
fake auth
demo password
user_me
hardcoded data

ถ้าต้องการ development seed:

สร้าง seed script แยก

Development seed ≠ production data

============================================================
TESTING
============================================================

ทุก feature ที่แก้ต้อง test

อย่างน้อย:

Register
Login
Logout
Profile update
Friend request
Accept friend
Block
Create post
Like
Comment
Send message
Read message
Notification

ทดสอบ:

Success
Failure
Unauthorized
Forbidden
Invalid input
Not found

============================================================
VERSION WORKFLOW
============================================================

ห้ามแก้ทุกอย่างพร้อมกัน

VERSION 0:

Audit only

Commit:

chore: audit user app and establish baseline

------------------------------------------------------------

VERSION 1:

Authentication + Session

Commit:

feat(auth): implement real user authentication

------------------------------------------------------------

VERSION 2:

Database + User Profile

Commit:

feat(users): implement persistent users and profiles

------------------------------------------------------------

VERSION 3:

Friends

Commit:

feat(friends): implement real friend system

------------------------------------------------------------

VERSION 4:

Feed

Commit:

feat(feed): implement persistent social feed

------------------------------------------------------------

VERSION 5:

Chat

Commit:

feat(chat): implement persistent realtime messaging

------------------------------------------------------------

VERSION 6:

Voice + Media

Commit:

feat(media): implement real media and voice messages

------------------------------------------------------------

VERSION 7:

Notifications

Commit:

feat(notifications): implement persistent notifications

------------------------------------------------------------

VERSION 8:

Search + Discovery

Commit:

feat(discovery): implement user search and discovery

------------------------------------------------------------

VERSION 9:

Settings + Privacy + Theme + i18n

Commit:

feat(settings): implement user preferences and localization

------------------------------------------------------------

VERSION 10:

UX + Performance

Commit:

perf(web): improve user experience and performance

------------------------------------------------------------

VERSION 11:

Security Hardening

Commit:

security: harden user application

------------------------------------------------------------

VERSION 12:

Testing + Production Readiness

Commit:

chore(prod): prepare user application for production

============================================================
COMMIT RULE
============================================================

ก่อนทุก commit:

git status
git diff
git diff --stat

run:

typecheck
lint
tests
build

ถ้ามี error:

DO NOT COMMIT

แก้ก่อน

หลัง commit:

git log --oneline

ตรวจว่า commit แยกตาม version จริง

============================================================
IMPORTANT
============================================================

อย่าพยายามทำทุกอย่างให้เสร็จในครั้งเดียว

อย่ารื้อ UI โดยไม่มีเหตุผล

อย่าเพิ่ม feature เพียงเพื่อให้ดูเยอะ

อย่าเขียน mock implementation เพื่อให้ test ผ่าน

ถ้าระบบยังไม่ทำจริง:

ระบุว่า NOT IMPLEMENTED

แล้ว implement ให้จริงตาม priority

============================================================
FINAL PRODUCT GOAL
============================================================

เมื่อ User เปิด GUKGIC:

Register / Login
↓
Home
↓
สร้าง Post
↓
ค้นหาคน
↓
Add Friend
↓
Accept Friend
↓
ดู Profile
↓
ส่ง Message
↓
ส่ง Voice Message
↓
ได้รับ Notification
↓
Like / Comment
↓
Settings
↓
เปลี่ยนภาษา
↓
เปลี่ยน Theme

ทุกอย่างต้องเชื่อมต่อกันจริง

Database ต้องเก็บข้อมูลจริง

Refresh หน้าแล้วข้อมูลต้องไม่หาย

Logout แล้วเข้าหน้า protected ไม่ได้

User A ต้องไม่สามารถเข้าถึงข้อมูลของ User B
โดยแก้ request เอง

นี่คือ Definition of Done ของ User App

============================================================
END
============================================================