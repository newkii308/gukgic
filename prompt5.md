GUKGIC — CURRENT IMPLEMENTATION
PRODUCTION HARDENING CYCLE
======================================

This is the CURRENT repository.

IMPORTANT:

The project has already been migrated to Prisma.

DO NOT rebuild the database layer from scratch.

DO NOT replace Prisma with another ORM.

DO NOT redesign the existing UI.

DO NOT create a new architecture unless the current architecture is fundamentally broken.

Your job is to inspect the CURRENT implementation,
find remaining real problems,
and harden the existing system.

======================================
CURRENT BASELINE
======================================

The current code already contains:

- Prisma database layer
- Prisma schema
- persistent User data
- persistent Friendships
- persistent Friend Requests
- persistent Posts
- persistent Likes
- persistent Comments
- persistent Conversations
- persistent Messages
- persistent Notifications
- authentication
- API validation
- rate limiting
- Socket.IO
- storage abstraction
- User App UI
- Admin foundation

Treat these as existing implementation.

Verify them before changing anything.

======================================
PRIMARY GOAL
======================================

Do NOT add more features.

Make the CURRENT User App:

- correct
- persistent
- secure
- consistent
- testable
- reliable

Focus on fixing implementation gaps.

======================================
STEP 1 — AUDIT CURRENT CODE
======================================

Inspect the actual implementation first.

Do not rely only on:

README.md
AUDIT.md
prompt files
comments

The source code is the source of truth.

Audit:

src/app
src/components
src/hooks
src/lib
src/types
src/i18n
prisma
server.js
tests
configuration

Classify every important system:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Do not modify code during the initial audit.

Produce a concise internal checklist before implementation.

======================================
STEP 2 — DATABASE VERIFICATION
======================================

Prisma is already implemented.

Verify that runtime code actually uses Prisma everywhere.

Find any remaining:

- in-memory state
- JSON persistence
- fake database functions
- hardcoded runtime users
- hardcoded runtime posts
- fake messages
- demo data loaded automatically

Remove only production runtime dependencies.

Keep development seed data isolated.

Do NOT rewrite working Prisma models unnecessarily.

Verify:

- foreign keys
- unique constraints
- indexes
- relation integrity
- transaction requirements
- duplicate prevention

======================================
STEP 3 — AUTHENTICATION
======================================

Verify:

register
login
logout
session validation
protected API

Remove any remaining:

- user_me
- demo identity
- client-controlled identity
- production JWT fallback
- authentication bypass

Development-only shortcuts must never work in production.

The authenticated session must be the source of user identity.

======================================
STEP 4 — SOCKET.IO
======================================

This is a HIGH PRIORITY area.

Verify socket authentication.

Remove development identity fallback if it can bypass authentication.

Never trust:

socket.handshake.query.userId

for production identity.

Conversation rooms must verify membership.

Typing events must verify conversation membership.

Message events must not trust arbitrary client payloads.

IMPORTANT:

Socket.IO is a realtime delivery layer.

Database is the source of truth.

Do not treat a socket payload as a canonical Message.

The canonical flow should be:

Client
→ authenticated API / validated operation
→ authorization
→ database
→ canonical result
→ Socket.IO event

Do not broadcast unverified client data.

======================================
STEP 5 — CHAT CONSISTENCY
======================================

Verify:

send message
receive message
refresh
read state
unread count
delete/unsend
reply
voice message
image message

Test two real users.

A sends to B.

B receives the exact database message.

Refresh both clients.

The message must remain identical.

Prevent:

duplicate messages
fake optimistic messages
messages from unauthorized users
messages sent to unauthorized conversations

======================================
STEP 6 — PROFILE / PRIVACY
======================================

Verify existing allowlist implementation.

Users must only modify fields they own.

Verify:

profileVisibility
postVisibility
whoCanSendRequests

These settings must be enforced server-side.

Do not rely on frontend hiding.

======================================
STEP 7 — FRIEND SYSTEM
======================================

Verify:

add
cancel
accept
reject
remove
block
unblock

Prevent:

self request
duplicate request
duplicate friendship
blocked interaction
unauthorized mutation

Test concurrent duplicate requests.

Use database constraints where appropriate.

======================================
STEP 8 — FEED
======================================

Verify:

create
delete
like
unlike
comment
delete comment

Verify ownership.

A user must not be able to modify another user's content.

Verify database-level pagination.

Do not load the entire table into memory.

======================================
STEP 9 — NOTIFICATIONS
======================================

Verify that notifications are created from real events.

Test:

friend request
friend accept
like
comment
message

Verify:

unread count
mark read
mark all read

No fake notification state.

======================================
STEP 10 — MEDIA / STORAGE
======================================

Inspect the CURRENT storage implementation.

Do not assume the abstraction means production storage is complete.

Verify:

file size validation
MIME validation
extension validation
ownership
safe filenames
storage persistence
error handling

Voice messages must use real uploaded media.

No sample/fake audio in production flows.

If local filesystem storage remains,
document it as a production limitation instead of falsely claiming production readiness.

======================================
STEP 11 — SETTINGS
======================================

Audit all settings actions.

Find buttons that only:

show alert
change local state
pretend to save

Especially verify:

change password
logout other devices
delete account
privacy
notification preferences

Do not implement fake success.

Either implement correctly
or clearly mark the feature as unavailable.

======================================
STEP 12 — API AUDIT
======================================

Inspect every API route.

For each mutation verify:

Authentication
Authorization
Validation
Business logic
Database
Error handling

Check for:

IDOR
mass assignment
missing ownership checks
missing membership checks
missing rate limits
unsafe error messages

======================================
STEP 13 — ERROR STATES
======================================

Verify every async User App feature has:

loading
empty
error
success

Optimistic updates must rollback after failure.

No fake success messages.

======================================
STEP 14 — TESTING
======================================

Run:

npm install
npx prisma generate
npx prisma validate
npm run lint
npm run build

Run all existing tests.

Fix actual implementation errors.

Do not weaken tests just to make them pass.

Add tests for discovered bugs.

======================================
TWO USER TEST
======================================

Use:

User A
User B

Verify:

Register
Login
Profile
Friend request
Accept
Post
Like
Comment
Notification
Conversation
Message
Refresh
Logout
Login again

Verify persistence after restart.

======================================
SECURITY TEST
======================================

Attempt:

modify another user's profile
modify another user's post
delete another user's post
join unauthorized conversation
send unauthorized message
access private profile
interact while blocked
modify protected user fields

All must fail server-side.

======================================
DO NOT OVERENGINEER
======================================

Do NOT build:

- new Admin features
- advertiser platform
- analytics
- microservices
- Kubernetes
- unnecessary Redis infrastructure
- WebRTC calls

Focus on the existing User App.

======================================
GIT
======================================

Before changes:

git status
git log --oneline -10

Do not overwrite unrelated existing changes.

After changes:

git diff
git diff --stat

Run validation before commit.

Commit only after tests/build pass.

Suggested commit:

fix(core): harden current user app implementation

======================================
FINAL REPORT
======================================

Report:

1. What was already working
2. What was actually broken
3. Files changed
4. Bugs fixed
5. Security issues fixed
6. Tests added
7. Tests passed
8. Remaining limitations
9. Remaining P0/P1 issues
10. Recommended next version

Do not claim production-ready if significant issues remain.

======================================
CORE RULE
======================================

DO NOT REBUILD WHAT ALREADY WORKS.

INSPECT FIRST.

FIX SECOND.

TEST THIRD.

COMMIT LAST.

The goal is not more code.

The goal is more correctness.
======================================