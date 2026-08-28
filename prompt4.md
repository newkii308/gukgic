GUKGIC — PRODUCTION DEVELOPMENT CYCLE
======================================

You are working on the CURRENT repository.

IMPORTANT:
- Inspect the actual codebase before changing anything.
- Do not assume the project is still in its previous state.
- Do not blindly follow old README/AUDIT documents if they conflict with the current code.
- Preserve the existing UI and visual direction.
- Do not redesign working screens unnecessarily.
- Do not add random features.
- Do not prioritize Admin features.

PRIMARY GOAL:
Turn the existing User App from a prototype into a real, persistent, secure web application.

======================================
1. AUDIT FIRST
======================================

Before coding, inspect:

- src/app
- src/components
- src/hooks
- src/lib
- src/types
- src/services
- API routes
- Prisma
- database layer
- Socket.IO
- authentication
- storage
- tests
- configuration

Classify important features as:

REAL
PARTIAL
MOCK
BROKEN
MISSING

Identify the highest-impact problems.

Do not start rewriting blindly.

======================================
2. DATABASE FOUNDATION
======================================

The database must become the source of truth.

Target:

PostgreSQL + Prisma

Inspect the existing Prisma schema first.
Reuse and improve it where appropriate.

Remove production dependence on:

- JSON database
- in-memory arrays
- runtime seed data
- hardcoded users/posts/messages

Development seed data is allowed, but it must be isolated:

prisma/seed.ts

Production must never automatically load seed data.

Add proper:

- relations
- foreign keys
- unique constraints
- indexes
- timestamps
- cascading behavior where appropriate

Use database-generated IDs such as cuid/UUID/ULID.

Do not use Date.now() as primary identifiers.

======================================
3. AUTHENTICATION
======================================

Authentication must use real persistent users and sessions.

Remove:

- hardcoded JWT secrets
- demo identities
- user_me fallbacks
- client-controlled identity
- fake authentication

JWT_SECRET must come from environment configuration.

If required secrets are missing:
fail clearly instead of using a hardcoded fallback.

Protected API:

No valid session → 401

User identity must come from the authenticated session,
never from a client-supplied userId.

Implement:

- register
- login
- logout
- session validation
- expiration
- session revocation

======================================
4. PROFILE SECURITY
======================================

Audit profile APIs carefully.

Never merge arbitrary request bodies into User records.

Use explicit schemas/allowlists.

Users must NOT be able to modify:

- role
- ban/suspension state
- counters
- ownership fields
- internal fields
- system fields

Use server-side validation.

======================================
5. PRIVACY
======================================

Existing privacy settings must actually work.

Enforce privacy server-side.

Check:

- profiles
- posts
- friend requests
- messaging

Example:

Public → accessible according to public rules
Friends → accessible only to friends
Private → restricted

Never rely only on frontend hiding.

======================================
6. FRIEND SYSTEM
======================================

Implement and verify:

- add friend
- cancel request
- accept
- reject
- remove friend
- block
- unblock

Prevent:

- self requests
- duplicate requests
- duplicate friendships
- blocked-user interaction
- unauthorized mutations

Use database constraints plus application-level validation.

Respect friend-request privacy settings.

======================================
7. FEED
======================================

Implement real persistence for:

- create post
- edit post
- delete post
- like
- unlike
- comment
- delete comment

Do not use mock runtime data.

Pagination must happen at database level.

Do not:

load everything → sort in memory → slice

Prefer cursor pagination where appropriate.

======================================
8. CHAT
======================================

Chat must use persistent messages.

Socket.IO is a realtime delivery layer, NOT the database.

Socket authentication must use the authenticated session.

Never trust:

socket.handshake.query.userId

Before joining a conversation:

authenticate
→ verify conversation membership
→ allow join

Before sending:

authenticate
→ authorize conversation
→ validate message
→ persist message
→ emit canonical server message

The database message is the source of truth.

======================================
9. OPTIMISTIC UI
======================================

For optimistic actions:

UI update
→ API request
→ success → keep/update with canonical server data
→ failure → rollback + show error

Never leave fake messages, likes, or actions in the UI after API failure.

======================================
10. NOTIFICATIONS
======================================

Persist notifications for:

- friend requests
- accepted requests
- likes
- comments
- messages

Support:

- unread
- read
- mark as read
- mark all as read

Unread counts must come from real server state.

======================================
11. MEDIA / VOICE
======================================

Audit:

- avatars
- covers
- post images
- chat images
- voice messages

Do not use local filesystem/public uploads as the production storage architecture.

Create a storage abstraction suitable for S3-compatible/object storage.

Validate:

- MIME type
- file size
- extension
- ownership

Do not generate fake/sample voice messages in production flows.

======================================
12. API SECURITY
======================================

Every mutation endpoint must have:

Authentication
Authorization
Validation
Business logic
Database operation
Error handling

Use Zod or an equivalent schema validation system.

Never trust client-provided:

- userId
- ownerId
- role
- permissions

======================================
13. ERROR HANDLING
======================================

Every async feature needs:

- loading
- success
- error
- empty
- retry where appropriate

Never expose:

- stack traces
- SQL errors
- internal exceptions
- secrets

======================================
14. RATE LIMITING
======================================

Add reasonable protection for high-risk endpoints:

- login
- register
- password changes
- friend requests
- messaging
- search
- uploads

Do not overengineer distributed infrastructure yet.

Keep the architecture extensible.

======================================
15. FRONTEND
======================================

Preserve the existing design.

Do NOT rebuild the UI unless required.

Focus on:

- real API integration
- correct state management
- loading states
- error states
- empty states
- optimistic rollback
- accessibility
- responsive behavior

Every interactive control must either:

WORK

or

be clearly unfinished.

No fake success behavior.

======================================
16. TESTING
======================================

After implementation, run:

- typecheck
- lint
- tests
- build

Add integration tests for critical flows.

Test:

- success
- 401
- 403
- 404
- invalid input
- duplicate actions
- blocked users
- expired sessions
- unauthorized resource access

======================================
17. TWO-USER TEST
======================================

Test using two real accounts:

User A
User B

Flow:

A registers
→ B registers
→ A logs in
→ B logs in
→ A discovers B
→ A sends friend request
→ B accepts
→ A creates post
→ B likes
→ B comments
→ A receives notification
→ A opens chat
→ A sends message
→ B receives message
→ refresh
→ message still exists
→ logout
→ login again
→ data still exists

All data must be persistent.

======================================
18. RESTART TEST
======================================

Stop the application.

Restart it.

Verify that user data, posts, friendships, messages,
and notifications still exist.

No production data may depend on process memory.

======================================
19. SECURITY TEST
======================================

Attempt to:

- modify another user's profile
- modify role
- access private profiles
- join unauthorized conversations
- send unauthorized messages
- interact while blocked
- delete another user's post
- access another user's private data

All unauthorized operations must fail server-side.

======================================
20. DO NOT OVERENGINEER
======================================

Do NOT introduce:

- microservices
- Kubernetes
- complex event buses
- unnecessary Redis infrastructure
- advanced analytics
- advertiser dashboards
- large admin systems

The product is web-first.

Keep the architecture simple, maintainable, and scalable.

======================================
21. DEFINITION OF DONE
======================================

Do not call this production-ready unless:

[ ] PostgreSQL is the real source of truth
[ ] Prisma is used in runtime
[ ] No production JSON/in-memory database
[ ] Seed data is isolated
[ ] Authentication is real
[ ] Sessions are persistent/revocable
[ ] No hardcoded secrets
[ ] Protected APIs use authenticated identity
[ ] Profile updates use allowlists
[ ] Privacy is enforced server-side
[ ] Friend system is persistent
[ ] Feed is persistent
[ ] Chat is persistent
[ ] Socket authentication is secure
[ ] Conversation authorization works
[ ] Notifications are persistent
[ ] Media handling is safe
[ ] Fake voice/demo fallbacks are removed from production flows
[ ] API validation exists
[ ] Error handling exists
[ ] Critical tests pass
[ ] Typecheck passes
[ ] Lint passes
[ ] Build passes
[ ] Restart does not lose data

======================================
22. GIT WORKFLOW
======================================

Before changes:

git status
git log --oneline -10

Inspect existing uncommitted changes before modifying anything.

After implementation:

git diff
git diff --stat

Run:

typecheck
lint
tests
build

Fix all errors before committing.

Commit only the completed version.

Suggested commit:

feat(database): migrate user app to production persistence

======================================
23. FINAL REPORT
======================================

After finishing, report:

1. Files changed
2. Database changes
3. API changes
4. Authentication changes
5. Security fixes
6. Tests added
7. Tests passed
8. Known limitations
9. Remaining P0 issues
10. Remaining P1 issues
11. Recommended next version

Do not hide known issues.

Do not claim production-ready if critical issues remain.

======================================
CORE RULE
======================================

Do not make GUKGIC LOOK like a real social app.

Make GUKGIC WORK like a real social app.

Preserve the existing UI.

Fix the system underneath it.

Work incrementally.

Verify before committing.