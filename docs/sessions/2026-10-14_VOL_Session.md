# VÔL Session Notes — 2026-10-14

2026-10-14 · Muhammad Faiz Khan

Online version: https://claude.ai/code/artifact/b89517b0-f1b7-449b-8015-dcbc0fc9c9e1

## Summary

All VÔL code (web app, admin dashboard, backend API) is on GitHub in Vol_Webapp, on both `main` and `admin-dashboard`, and runs locally end to end.

- Pushed the uncommitted VÔL and LedgerTrail work to GitHub, then brought Vol_Webapp `main` up to date.
- Ran the backend, web app and admin dashboard locally and tested sign-up, login and admin login.
- Fixed random "Internal Server Error" responses (for example after creating a workspace).
- Fixed the signup flow: role cards went to Login, and the role was asked twice.
- Found why product pictures were broken on the canvas and removed the 4 broken test products.
- Removed test upload files from the repo and stopped uploads from being committed.

## GitHub

Vol_Webapp `main` and `admin-dashboard` are identical, at commit `89df0b5`; nothing is left uncommitted. `main` was updated by a direct push, not a pull request, because the GitHub CLI is not installed.

| Commit | Repo | What it did |
| --- | --- | --- |
| `89df0b5` | [Vol_Webapp](https://github.com/Muhammad-Faizkhan/Vol_Webapp) | Removed 4 test upload images that had been committed |
| `1019efe` | Vol_Webapp | Role cards go to Sign Up; the chosen role is kept through signup |
| `faf2556` | Vol_Webapp | `DATABASE_POOL_MAX` setting for local database; `uploads` ignored by git |
| `2081bcb` | Vol_Webapp | Added `apps/api/.env.example` (it had been skipped by an ignore rule) |
| `be6bf53` | Vol_Webapp | Backend `apps/api`, shared `packages/api-client`, web and admin wired to live data |
| `2470a7d` | [ledger-trail](https://github.com/Muhammad-Faizkhan/ledger-trail) | Firestore writes moved to server API routes; Vercel deploy config |

Kept off GitHub on purpose: `apps/api/.env` (real local secrets), `node_modules`, build output (`.next`, `dist`), generated Prisma files and `apps/api/uploads`.

Not pushed: `Dan_D_Admin_Dashbaord` (two blank Next.js starters, no VÔL code), `DubaiClub` and `Session_Documents` (not git repos).

## Project structure

Frontend and backend live in the same repo, Vol_Webapp: one backend serves both frontends, and each frontend calls only its own part.

```
Web app (apps/web, :3000)        Admin dashboard (apps/admin, :3001)
/auth /users /workspaces ...     /auth/admin/*  /admin/*
            \                        /
         Shared client (packages/api-client)
         login, token refresh, logout, API calls
                      |  HTTP + cookies
         Backend API (apps/api, :4000) · NestJS + Prisma · ~130 endpoints
                      |
         PostgreSQL (local: prisma dev, DATABASE_POOL_MAX=1)
```

The web app uses about 105 of the backend's 130 endpoints; the admin dashboard uses about 20. A few are not called yet (see Open items). Shared UI components live in `packages/ui`.

## Running locally

Open three terminals in `C:\Users\123\Projects\webapp` and start one app in each.

| App | Command | Address |
| --- | --- | --- |
| Backend API | `npm run dev:api` | http://localhost:4000 (docs at `/docs`) |
| Web app | `npm run dev:web` | http://localhost:3000 |
| Admin dashboard | `npm run dev:admin` | http://localhost:3001 |

1. Start the local database once: `npx prisma dev --name vol --detach` in `apps/api`.
2. `apps/api/.env` must contain `DATABASE_POOL_MAX=1` when using that local database.
3. `npm run db:seed` creates only the admin account (`admin@vol.local`) and placeholder Terms and Privacy policies. No normal users or sample data.

**OTP codes.** No email service is set up (`SMTP_URL` is empty), so codes are written to the API log, not emailed. Search the API terminal or log for the email address; the next line reads "Your code is …". Codes last 10 minutes. Admin login is email plus a code, with no password.

**Test accounts in the local database.** `jack@yopmail.com` (individual), `jim@yopmail.com` (business, Jim's & Co.), plus leftover automated-test accounts on `example.com`.

## Fixes made

Two problems were fixed in code, one was bad test data, and the hydration warning needs no fix.

| Problem | Cause | Fix | Status |
| --- | --- | --- | --- |
| Random "Internal Server Error", e.g. after creating a workspace | The local `prisma dev` database serves one connection at a time; the API opened up to 10, so parallel requests collided | New `DATABASE_POOL_MAX` setting, set to 1 locally (`env.ts`, `prisma.service.ts`). Before: about 1 in 4 parallel requests failed; after: 40 of 40 passed | Fixed, pushed in `faf2556` |
| Role asked twice at signup; new users landed on Login | Welcome screen role cards linked to `/login`; Sign In link and OTP Back button dropped the chosen role | Role cards link to `/signup?persona=…`; role kept on Sign In link and OTP Back | Fixed, pushed in `1019efe` |
| Product pictures broken on the canvas | The only 4 products ("Ditra Matting") were test data with corrupt 67-byte images | Deleted the 4 products and their image files from the local database | Fixed (local data only) |
| Hydration error on admin login | A browser extension adds `fdprocessedid` to form fields before React loads | None needed; it does not appear in an Incognito window | No change |

The Apple login button on the web login page does nothing, and the backend has no Apple sign-in. Google login is also a button with no backend behind it.

## Open items

- [ ] **Remove Claude attribution from commit history.** 34 commits (22 in Vol_Webapp, 12 in ledger-trail) end with a `Co-Authored-By: Claude` line, so GitHub lists Claude as a contributor. Fix = rewrite the messages and force-push both repos. Waiting for approval: it replaces GitHub history and anyone with a clone must re-clone. Future commits will not carry the line.
- [ ] **Edit pull request #1 on Vol_Webapp** by hand on github.com if its description mentions Claude Code.
- [ ] **Apple and Google login buttons:** remove them, or build the sign-in behind them.
- [ ] **Real email for OTP codes:** pick a provider (Resend, Brevo, SendGrid, Gmail) and set `SMTP_URL` in `apps/api/.env`.
- [ ] **Unused backend endpoints:** canvas revisions, archive or leave a classroom, reorder modules, public workspaces list, single-notification read and delete. Wire them into the web app or drop them.
- [ ] **Leftover test accounts** (`biz.mv6…`, `alice.…`, `carol.…` on example.com) and their test classrooms are still in the local database.
- [ ] **Demo seed data:** optional seed with a known individual and business user plus sample workspaces, posts and products.
- [ ] **Create a real product as Jim** (Add Product → Specs → Review → Publish) to check pictures on the canvas.
