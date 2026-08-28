สร้างเว็บแอป Social / Find Friends สำหรับผู้ใช้ในลาว โดยออกแบบเป็น Production-ready Web App
ที่ในอนาคตสามารถนำโค้ดชุดเดียวกันไป Build เป็น Android และ iOS ผ่าน Capacitor ได้

ชื่อโปรเจกต์: Friend Social App
กลุ่มผู้ใช้หลัก: คนรุ่นใหม่ / Gen Z / ผู้ใช้ในประเทศลาว
ภาษาเริ่มต้น: ລາວ
รองรับหลายภาษา:
- ລາວ (Lao) — ภาษาหลัก
- English
- ไทย
- 中文
- Tiếng Việt

==================================================
1. TECH STACK
==================================================

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- ใช้ App Router
- Component-based architecture
- Responsive Design
- Mobile-first
- PWA-ready
- เตรียมโครงสร้างให้รองรับ Capacitor ในอนาคต

Backend:
- Node.js
- TypeScript
- REST API
- WebSocket สำหรับระบบ Real-time
- PostgreSQL
- Redis สำหรับ cache / online status / realtime data ที่เหมาะสม
- Object Storage สำหรับรูปโปรไฟล์และไฟล์ media

Deployment:
- Railway
- แยก Frontend / Backend / PostgreSQL / Redis ตามความเหมาะสม
- ใช้ Environment Variables
- ห้าม hardcode secret, API key หรือ database credentials

==================================================
2. CORE CONCEPT
==================================================

เป็น Social Web App สำหรับ "หาเพื่อน" ไม่ใช่ Dating App เป็นหลัก

ผู้ใช้สามารถ:
- สร้าง Profile
- ใส่ชื่อ / username
- รูปโปรไฟล์
- Bio
- ความสนใจ
- ภาษา
- ประเทศ / เมือง
- เพิ่มเพื่อน
- รับคำขอเป็นเพื่อน
- ยกเลิกคำขอ
- ลบเพื่อน
- ค้นหาผู้ใช้
- ดู Profile
- แชทกับเพื่อน
- ส่งข้อความ
- ส่ง Voice Message
- ดูสถานะ Online / Offline
- ดูเวลาที่ออนไลน์ล่าสุด
- Notification

ยังไม่ต้องทำระบบโทร Voice Call / Video Call

ต้องออกแบบ Architecture ให้สามารถเพิ่มระบบโทรในอนาคตได้โดยไม่ต้องรื้อระบบ Chat ใหม่ทั้งหมด

==================================================
3. DESIGN STYLE
==================================================

ต้องการ UI ที่:

- ทันสมัย
- สะอาด
- Smooth
- Minimal
- Gen Z
- Friendly
- Premium แต่ไม่หรูจนเข้าถึงยาก
- ใช้งานง่าย
- ไม่รก
- ไม่ใส่ Gradient เยอะเกินไป
- ไม่ใช้ Card ซ้อน Card เยอะ
- ไม่ทำ UI ให้ดูเหมือน Dashboard
- มี whitespace ที่เหมาะสม
- Typography อ่านง่าย
- Animation ลื่นและ subtle

เน้น Mobile-first เพราะผู้ใช้ส่วนใหญ่จะเข้าผ่านมือถือ

Desktop:
- ใช้พื้นที่หน้าจออย่างมีประสิทธิภาพ
- จำกัด max-width ของ content
- ไม่ให้ content กว้างจนอ่านยาก

Mobile:
- Bottom Navigation
- Thumb-friendly buttons
- ปุ่มไม่เล็กเกินไป
- Chat ใช้งานด้วยมือเดียวได้
- Feed เลื่อนง่าย
- ไม่ให้ UI แน่น

==================================================
4. LANGUAGE / LOCALIZATION
==================================================

ภาษาหลักคือ "ภาษาลาว"

ข้อความ UI ทั้งหมดต้องรองรับ i18n

ตัวอย่างภาษาลาวต้องเป็นธรรมชาติ ไม่ใช่แปลตรงตัวจากภาษาอังกฤษ

ใช้ภาษาลาวที่:
- ลื่นไหล
- เป็นธรรมชาติ
- ทันสมัย
- เข้าใจง่าย
- เหมาะกับ Gen Z
- ไม่เป็นภาษาราชการจนเกินไป

ตัวอย่าง:

"ເພີ່ມເພື່ອນ"
"ສົ່ງຄຳຂໍ"
"ຍອມຮັບ"
"ກຳລັງອອນລາຍ"
"ຫາເພື່ອນໃໝ່"
"ສົນໃຈຫຍັງແດ່?"
"ເລີ່ມແຊັດ"
"ຂໍ້ຄວາມ"
"ແຈ້ງເຕືອນ"

อย่าใช้ภาษาลาวแบบแข็งหรือเป็นทางการเกินไป

ต้องรองรับ:
- RTL-safe architecture แม้ภาษาปัจจุบันจะไม่ได้ใช้ RTL
- Unicode อย่างถูกต้อง
- Lao characters ไม่แตก
- การตัดคำภาษาลาวอย่างเหมาะสม

==================================================
5. FONT
==================================================

เลือก Font ที่รองรับ:

Lao
Thai
English
Chinese
Vietnamese

ต้องมี fallback font ที่เหมาะสม

Typography ต้อง:
- สวย
- อ่านง่าย
- ไม่บางเกินไป
- รองรับภาษาเอเชีย
- มี hierarchy ชัดเจน

ห้ามใช้ font ที่รองรับเฉพาะ English

แนะนำให้ใช้ font family ที่รองรับ Lao / Thai / Latin / Vietnamese / Chinese
และจัด fallback สำหรับ CJK อย่างเหมาะสม

==================================================
6. THEME SYSTEM
==================================================

ต้องมี 3 modes:

1. Light
2. Dark
3. System

Settings:

Appearance:
○ Light
○ Dark
○ System

System mode ต้องตรวจสอบ prefers-color-scheme

Theme ต้องเปลี่ยนทั้งระบบแบบ smooth

Dark Mode:
- ไม่ใช้ดำสนิททุกจุด
- ใช้ dark surface ที่อ่านง่าย
- contrast ดี
- ลด eye strain
- สีข้อความต้อง accessible

Light Mode:
- background สะอาด
- ไม่ขาวจ้าเกินไป
- ใช้ subtle surface

ผู้ใช้สามารถเปลี่ยน Theme ได้ทันทีโดยไม่ reload หน้า

บันทึก preference ของผู้ใช้

==================================================
7. MAIN NAVIGATION
==================================================

Mobile:

Home
Friends
Messages
Notifications
Profile

ใช้ Bottom Navigation ที่เรียบง่าย

Desktop:

Sidebar หรือ compact navigation
แต่ต้องไม่ทำให้เหมือน Admin Dashboard

==================================================
8. HOME / FEED
==================================================

สร้าง Social Feed ที่สะอาดและใช้งานง่าย

Feed สามารถมี:
- User posts
- Text post
- Image post
- Friend recommendation
- Suggested users
- Advertisement

Feed ต้องสามารถรองรับ Advertisement ในอนาคต

โครงสร้าง:

Post
Post
Friend Recommendation
Post
Advertisement
Post
Post

Advertisement ต้องมี label ชัดเจนว่า:
"ໂຄສະນາ"
หรือ
"Sponsored"

ห้ามทำโฆษณาให้ดูเหมือนข้อความของผู้ใช้จนหลอกผู้ใช้

Ads ต้องเป็น component แยก:

<AdCard />

เพื่อให้อนาคตเชื่อมกับระบบ Ad Server ได้ง่าย

==================================================
9. FRIEND SYSTEM
==================================================

ระบบเพื่อน:

- Add Friend
- Friend Request
- Accept
- Reject
- Cancel Request
- Remove Friend
- Block
- Unblock

สถานะ:

None
Pending
Incoming
Friends
Blocked

Button ต้องเปลี่ยนตามสถานะอัตโนมัติ

==================================================
10. USER PROFILE
==================================================

Profile ต้องมี:

- Avatar
- Cover
- Name
- Username
- Bio
- Location
- Languages
- Interests
- Friends count
- Posts
- Mutual friends

ปุ่ม:

Add Friend
Message
More

อย่าใส่ข้อมูลเยอะจน Profile ดูรก

==================================================
11. CHAT
==================================================

สร้างระบบ Chat แบบ Real-time

ต้องรองรับ:

- Text message
- Emoji
- Image
- Voice message
- Message timestamp
- Read status
- Delivered status
- Typing indicator
- Online status
- Reply message
- Delete message
- Unsend message

ใช้ WebSocket สำหรับ realtime

ห้ามใช้ polling หากไม่จำเป็น

Chat UI ต้อง:
- Smooth
- Modern
- Mobile friendly
- Bubble ไม่ใหญ่เกินไป
- อ่านง่าย
- Input อยู่ด้านล่าง
- Keyboard ไม่บัง input

==================================================
12. VOICE MESSAGE
==================================================

รองรับ Voice Message

ผู้ใช้:
กดค้าง / กดปุ่มอัดเสียง
↓
Recording
↓
Preview
↓
Send

Voice message แสดงเป็น:

▶ ━━━━━━━ 0:12

สามารถ:
- Play
- Pause
- แสดง duration
- แสดง progress

ยังไม่ต้องมี:
- Voice Call
- Video Call

แต่ Architecture ต้องรองรับการเพิ่มในอนาคต

==================================================
13. NOTIFICATION
==================================================

Notification สำหรับ:

- Friend Request
- Friend Request Accepted
- New Message
- Mention
- System notification

แสดง unread badge

ต้องมี:
Mark as read
Mark all as read

==================================================
14. SEARCH
==================================================

Search ผู้ใช้:

- Username
- Name
- Location
- Interests

Search UI ต้องเร็วและใช้งานง่าย

Debounce search

รองรับ mobile

==================================================
15. FRIEND DISCOVERY
==================================================

สร้างหน้า "Find Friends"

แสดง:

People you may know
Popular users
Same interests
Same language
Nearby / same city ถ้าผู้ใช้อนุญาต location

ไม่ต้องทำระบบ Match แบบ Dating

เน้นการหาเพื่อนและ Community

==================================================
16. SEO
==================================================

ต้องให้ SEO ดีสำหรับหน้า Public

ใช้ Next.js SEO features

ต้องมี:

- Metadata
- Title
- Description
- Open Graph
- Twitter/X Card
- Canonical URL
- robots.txt
- sitemap.xml
- Structured Data เมื่อเหมาะสม

Public Profile สามารถมี SEO ได้

ตัวอย่าง:

/u/username

แต่หน้า private เช่น:
- Messages
- Notifications
- Settings

ต้องไม่ถูก index

ใช้ semantic HTML

รองรับ:
- Google
- Bing
- Social sharing

อย่าทำ SEO ด้วยการยัด keyword

==================================================
17. PERFORMANCE
==================================================

ต้องเร็วมาก โดยเฉพาะมือถือ

ใช้:

- Lazy loading
- Image optimization
- Code splitting
- Dynamic imports
- Pagination / infinite scroll อย่างเหมาะสม
- WebSocket เฉพาะส่วนที่ต้อง realtime
- Redis cache
- CDN / object storage สำหรับ media

อย่าโหลดทุกอย่างตั้งแต่หน้าแรก

==================================================
18. SECURITY
==================================================

ต้องมี:

- Secure authentication
- Password hashing
- Session management
- Rate limiting
- Input validation
- API validation
- XSS protection
- CSRF protection ตาม architecture
- SQL injection protection
- File upload validation
- Image size limits
- Audio upload limits
- Permission checks ทุก API

ผู้ใช้ต้องไม่สามารถแก้ไขข้อมูลของ user อื่นผ่าน API ได้

อย่า trust client-side data

==================================================
19. BACKEND API
==================================================

ออกแบบ API เป็นระบบ เช่น:

/api/auth
/api/users
/api/profile
/api/friends
/api/posts
/api/comments
/api/messages
/api/notifications
/api/search
/api/uploads

แยก service และ module อย่างชัดเจน

อย่าเขียน backend ทั้งหมดในไฟล์เดียว

==================================================
20. DATABASE
==================================================

ออกแบบ PostgreSQL schema ที่รองรับ:

users
profiles
friendships
friend_requests
posts
post_media
comments
likes
conversations
conversation_members
messages
message_attachments
notifications
user_settings
reports
blocks
advertisements

ออกแบบ indexes ให้เหมาะสม

ใช้ migrations

==================================================
21. MODERATION
==================================================

เตรียมระบบ:

- Report user
- Report post
- Report message
- Block user
- Admin moderation

แต่ UI ต้องไม่รก

==================================================
22. RESPONSIVE
==================================================

ต้องรองรับ:

Mobile
Tablet
Desktop

Breakpoints ต้องออกแบบอย่างเป็นระบบ

ห้ามทำแค่ย่อ Desktop ลง Mobile

ต้องออกแบบ Mobile UI โดยเฉพาะ

==================================================
23. APP FUTURE
==================================================

ต้องออกแบบตั้งแต่ต้นให้สามารถใช้ Capacitor ในอนาคต:

Web:
Next.js + React

Future:

Android
iOS

อย่าเขียน logic ที่ผูกกับ browser โดยไม่จำเป็น

สร้าง abstraction สำหรับ:

- Push Notification
- Camera
- Microphone
- File picker
- Share
- Storage

เพื่อให้อนาคตสามารถเปลี่ยน implementation เป็น native API ได้

==================================================
24. PROJECT STRUCTURE
==================================================

ต้องจัดโครงสร้างประมาณ:

src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── feed/
│   ├── profile/
│   ├── friends/
│   ├── chat/
│   └── ads/
├── features/
│   ├── auth/
│   ├── friends/
│   ├── chat/
│   ├── feed/
│   └── notifications/
├── services/
├── hooks/
├── lib/
├── types/
├── i18n/
├── styles/
└── config/

อย่าใส่ทุกอย่างรวมใน components เดียว

==================================================
25. UX RULES
==================================================

สำคัญมาก:

"อย่าใส่ทุกฟีเจอร์ลงบนหน้าจอพร้อมกัน"

ทุกหน้าต้องมี:
- Clear hierarchy
- Primary action
- Secondary action
- Whitespace
- อ่านง่าย

หลีกเลี่ยง:
- Card เยอะเกินไป
- Border ทุกจุด
- Shadow หนัก
- Gradient เยอะ
- Icon เยอะจนรก
- Popup ที่ไม่จำเป็น
- Animation เยอะเกินไป

Animation ต้อง:
- 150–300ms โดยทั่วไป
- Smooth
- ไม่รบกวนการใช้งาน
- รองรับ prefers-reduced-motion

==================================================
26. GEN Z LAO EXPERIENCE
==================================================

ต้องให้ความรู้สึกเหมือน Social App สมัยใหม่ที่ออกแบบมาเพื่อคนรุ่นใหม่ในลาว

ไม่ต้องทำให้เหมือน Facebook รุ่นเก่า

ไม่ต้องทำให้เหมือนเว็บราชการ

ไม่ต้องทำให้เหมือน Admin Panel

เน้น:
- Friendly
- Social
- Fresh
- Fast
- Modern
- Simple

ใช้ micro-interactions เล็ก ๆ เช่น:
- Like animation
- Friend request feedback
- Message sent animation
- Online indicator
- Smooth page transition

==================================================
27. IMPORTANT
==================================================

อย่าสร้างแค่ Mockup

ต้องสร้างระบบจริงที่สามารถรันได้

ต้องมี:
- Functional frontend
- Functional backend
- Database schema
- API
- Authentication
- Real-time chat architecture
- Voice message architecture
- i18n
- Theme system
- SEO
- Responsive UI
- Error handling
- Loading states
- Empty states
- Skeleton loading
- Mobile UI

ทุก feature ต้องออกแบบให้ต่อยอดได้

เน้น Clean Architecture และ Maintainability

อย่าสร้างโค้ดที่ทำงานได้แค่ Demo

ก่อนเริ่มเขียนโค้ด ให้สร้าง Architecture และ folder structure
จากนั้นสร้างระบบเป็น module อย่างเป็นขั้นตอน

เป้าหมายสุดท้าย:

เว็บ Social / Find Friends ที่
"ลื่น + สวย + ทันสมัย + ภาษาลาวเป็นธรรมชาติ + Gen Z + SEO ดี + Mobile-first + รองรับ Ads + Realtime Chat + Voice Message + พร้อมต่อยอดเป็น Android/iOS"