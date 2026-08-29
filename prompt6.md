GUKGIC — PRODUCTIONIZATION / ZERO-DEMO CYCLE
================================================

OBJECTIVE
---------

Stop feature development.

Do NOT add new product features in this cycle.

The current goal is to transform the EXISTING GUKGIC application
from prototype/demo quality into a real production-quality application.

Do not make the application look more complete.

Make the existing application actually work.

Production correctness is more important than adding features.

================================================
CORE RULE
================================================

NO NEW FEATURES.

NO UI REDESIGN.

NO RANDOM REFACTORING.

NO FAKE IMPLEMENTATIONS.

NO DEMO FALLBACKS.

NO MOCK RUNTIME DATA.

NO "TODO" IMPLEMENTATIONS HIDDEN BEHIND SUCCESS UI.

Do not rewrite systems that already work correctly.

Inspect → identify → fix → test → verify.

================================================
PHASE 1 — COMPLETE CODEBASE AUDIT
================================================

Before modifying anything, inspect the ENTIRE current repository.

Do not rely on previous AI reports.

Do not assume previous fixes are correct.

The CURRENT SOURCE CODE is the source of truth.

Inspect:

- frontend
- backend
- API routes
- database
- Prisma
- authentication
- authorization
- sessions
- cookies
- Socket.IO
- chat
- friends
- feed
- notifications
- profile
- settings
- media
- uploads
- voice
- search
- i18n
- error handling
- validation
- rate limiting
- environment configuration
- tests
- build configuration
- deployment configuration

For every existing feature classify:

REAL
PARTIAL
MOCK
FAKE
BROKEN
INCOMPLETE
UNSAFE
MISSING

Do not immediately code.

First understand the system.

================================================
PHASE 2 — REMOVE DEMO BEHAVIOR
================================================

Find every remaining prototype/demo implementation.

Search for:

- mock data
- fake API responses
- hardcoded users
- hardcoded posts
- hardcoded messages
- fake notifications
- fake success responses
- setTimeout pretending to perform operations
- local-only state pretending to be persisted
- development authentication bypasses
- fallback users
- fallback secrets
- fake uploads
- fake voice messages
- placeholder business logic
- TODO implementations used at runtime
- console-only operations
- buttons that appear functional but do nothing

For each one:

If the feature already exists:
IMPLEMENT IT PROPERLY.

If it cannot safely be implemented in this cycle:
REMOVE the fake behavior and expose a proper unavailable/error state.

Never pretend an operation succeeded.

================================================
PHASE 3 — DATABASE
================================================

The existing Prisma implementation is already part of the project.

DO NOT blindly rebuild it.

Verify every production data path.

Database must be the source of truth.

No runtime production data may depend on:

- memory
- JSON files
- static arrays
- hardcoded objects
- browser localStorage
- sessionStorage

Verify:

- relations
- foreign keys
- unique constraints
- indexes
- cascading behavior
- transactions
- duplicate prevention
- ownership
- timestamps
- pagination

If SQLite is still being used:

Do not fake PostgreSQL support.

Make the database layer production-safe first.

Document PostgreSQL/Railway migration separately if it is not part of this cycle.

================================================
PHASE 4 — AUTHENTICATION
================================================

Authentication must be real.

Verify:

REGISTER
LOGIN
LOGOUT
SESSION VALIDATION
SESSION EXPIRATION
PROTECTED ROUTES

Remove:

- demo identity
- user_me fallback
- hardcoded credentials
- hardcoded secrets
- authentication bypasses
- client-controlled identity

Authenticated identity must come from the server-side authentication mechanism.

Never trust:

userId
ownerId
role
permissions

sent by the client.

================================================
PHASE 5 — AUTHORIZATION
================================================

Audit EVERY protected mutation.

Verify:

- ownership
- friendship permissions
- block rules
- privacy rules
- conversation membership
- resource access

Test IDOR-style scenarios.

User A must never be able to modify User B's resources
simply by changing an ID in the request.

Authorization must happen server-side.

================================================
PHASE 6 — PROFILE
================================================

Verify:

- view profile
- edit profile
- avatar
- privacy
- username
- bio
- settings

Only explicitly allowed fields may be modified.

Never accept arbitrary User fields.

Protected fields must remain server-controlled.

================================================
PHASE 7 — FRIEND SYSTEM
================================================

Make the EXISTING friend system production-safe.

Verify:

- search user
- send request
- cancel request
- accept
- reject
- remove friend
- block
- unblock

Prevent:

- self request
- duplicate request
- duplicate friendship
- blocked interaction
- unauthorized mutations
- invalid users
- race-condition duplicates

Use database constraints where appropriate.

================================================
PHASE 8 — FEED
================================================

Verify the EXISTING feed.

Verify:

- create post
- edit post
- delete post
- like
- unlike
- comment
- delete comment
- visibility

Everything must persist.

Verify ownership on every mutation.

Do not load unlimited data into memory.

Use proper database pagination.

================================================
PHASE 9 — CHAT
================================================

This is a critical production area.

Verify:

- conversations
- members
- messages
- unread state
- message persistence
- realtime delivery
- authorization
- optimistic UI

Socket.IO must NOT become the database.

Correct flow:

CLIENT
→ AUTHENTICATE
→ VALIDATE
→ AUTHORIZE
→ DATABASE
→ CANONICAL RESULT
→ SOCKET EVENT

Do not blindly broadcast arbitrary client payloads.

Remove any remaining client-controlled socket identity path.

Conversation membership must be checked server-side.

A user cannot:

- join another user's conversation
- send messages to unauthorized conversations
- impersonate another user
- inject arbitrary message identity

================================================
PHASE 10 — NOTIFICATIONS
================================================

Verify real persistence.

Existing notification events must create real notifications.

Verify:

- friend request
- friend accepted
- like
- comment
- message
- unread count
- mark read
- mark all read

No fake notification state.

================================================
PHASE 11 — MEDIA / CLOUDFLARE R2
================================================

Production storage target:

Cloudflare R2.

Do not use Railway/local filesystem as the final production media storage.

Keep the storage abstraction.

Implement/verify:

upload
delete
get URL
ownership
MIME validation
file size validation
safe object keys
error handling

Separate:

DATABASE METADATA

from:

R2 OBJECT STORAGE

Database stores metadata/reference.

R2 stores actual files.

Do not expose private storage credentials to the client.

Do not place R2 secret credentials in frontend code.

Use server-side or properly secured upload mechanisms.

================================================
PHASE 12 — VOICE
================================================

Voice functionality must be real if the existing UI exposes it.

Do not create fake/sample audio.

If upload/storage is not available:

show a real error/unavailable state.

Do not pretend that voice was sent successfully.

================================================
PHASE 13 — SETTINGS
================================================

Audit every existing setting.

Every button must either:

WORK

or

show a truthful unavailable state.

Pay special attention to:

- change password
- logout
- privacy settings
- notification settings
- account deletion
- session/device management

Never show success when nothing was persisted.

================================================
PHASE 14 — API
================================================

Inspect every API route.

For every mutation verify:

AUTHENTICATION
AUTHORIZATION
VALIDATION
BUSINESS LOGIC
DATABASE
ERROR HANDLING

Use schema validation.

Prevent:

- mass assignment
- IDOR
- privilege escalation
- missing ownership checks
- missing membership checks
- unsafe inputs
- excessive payloads

================================================
PHASE 15 — ERROR HANDLING
================================================

Production applications must handle failures.

Every async operation should have appropriate:

- loading
- success
- empty
- error
- retry where appropriate

Do not expose:

- stack traces
- SQL errors
- secrets
- internal implementation details

Frontend errors must not silently fail.

Backend errors must not pretend to succeed.

================================================
PHASE 16 — SECURITY
================================================

Perform a security-focused review.

Check:

- authentication bypass
- authorization bypass
- IDOR
- mass assignment
- privilege escalation
- unsafe file upload
- exposed secrets
- weak cookie configuration
- CORS
- CSRF where applicable
- XSS risks
- injection risks
- rate limiting
- sensitive error messages
- insecure realtime events

Fix real vulnerabilities.

Do not invent unnecessary complexity.

================================================
PHASE 17 — PERFORMANCE
================================================

Do not optimize blindly.

Fix obvious production problems:

- N+1 queries
- unbounded database queries
- loading entire tables
- excessive API payloads
- unnecessary repeated requests
- unnecessary rerenders
- memory leaks
- inefficient realtime listeners

Do not introduce complex infrastructure unless necessary.

================================================
PHASE 18 — FRONTEND QUALITY
================================================

Keep the existing UI.

Do not redesign the application.

Fix only functional problems:

- broken buttons
- incorrect state
- stale state
- loading problems
- error handling
- empty states
- API integration
- optimistic update rollback
- responsive bugs
- accessibility problems

The UI should communicate the real system state.

================================================
PHASE 19 — INTERNATIONALIZATION
================================================

Verify existing language support:

Lao
English
Thai
Chinese
Vietnamese

Do not rewrite translations unnecessarily.

Remove obvious hardcoded user-facing strings where practical.

Make sure switching languages does not break the application.

================================================
PHASE 20 — PRODUCTION CONFIGURATION
================================================

Audit environment variables.

No secrets in source code.

No production secrets committed to Git.

Provide appropriate environment variable validation.

Separate:

development
test
production

Do not allow development-only authentication or debug behavior
to silently remain active in production.

================================================
PHASE 21 — TEST REAL USER FLOWS
================================================

Use at least two real test users:

User A
User B

Verify:

REGISTER
→ LOGIN
→ PROFILE
→ SEARCH
→ FRIEND REQUEST
→ ACCEPT
→ POST
→ LIKE
→ COMMENT
→ NOTIFICATION
→ CHAT
→ MESSAGE
→ REFRESH
→ LOGOUT
→ LOGIN AGAIN

Data must remain correct.

Test failure cases too.

================================================
PHASE 22 — RESTART TEST
================================================

Stop the server.

Restart it.

Verify:

users
profiles
friendships
posts
comments
likes
conversations
messages
notifications

still exist.

No production data may depend on process memory.

================================================
PHASE 23 — BUILD & TEST
================================================

Run the project's actual validation commands.

At minimum:

- typecheck
- lint
- tests
- Prisma validation
- build

Fix errors.

Do not weaken tests to make them pass.

Do not delete tests because they expose bugs.

Add regression tests for important bugs discovered during this cycle.

================================================
PHASE 24 — FINAL DEMO SCAN
================================================

Before declaring the cycle complete:

Search the entire repository again for:

mock
dummy
fake
demo
placeholder
TODO
FIXME
setTimeout
hardcoded user
hardcoded data
fallback
console.log

For every result:

Determine whether it is:

SAFE DEVELOPMENT CODE

or

PRODUCTION PROBLEM

Remove/fix production problems.

Do not blindly delete legitimate development utilities.

================================================
PHASE 25 — PRODUCTION READ

