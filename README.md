# VÔL

npm workspaces monorepo: two Next.js apps that share brand tokens, plus the NestJS API they call.

```
apps/web     user-facing app (port 3000)
apps/admin   admin dashboard (port 3001)
apps/api     NestJS + Prisma + PostgreSQL backend (port 4000)
packages/ui  shared brand tokens (@vol/ui/tokens.css)
```

## Getting started

Install once from the repo root, then run either app:

```bash
npm install
npm run dev:web     # http://localhost:3000
npm run dev:admin   # http://localhost:3001
```

`npm run build:web` / `npm run build:admin` / `npm run build:api` build each app; `npm run lint` lints
the Next.js apps.

To add a dependency to one app: `npm install <pkg> -w admin` (or `-w web`, `-w api`).

## Backend (apps/api)

NestJS 12 (ESM) on Node 22, Prisma 7 with PostgreSQL, our own auth. The data model for every
feature lives in `apps/api/prisma/schema.prisma`.

First-time setup:

```bash
cd apps/api
cp .env.example .env               # then fill in JWT_ACCESS_SECRET, CODE_PEPPER, SEED_ADMIN_PASSWORD
npx prisma dev --name vol --detach # local Postgres, no Docker needed (or point DATABASE_URL at any Postgres)
npm run db:migrate                 # apply migrations
npm run db:seed                    # first admin account + initial Terms/Privacy
cd ../..
npm run dev:api                    # http://localhost:4000, API docs at http://localhost:4000/docs
```

After editing `schema.prisma`, run `npm run db:migrate -w api -- --name <change>`; it creates the
migration and regenerates the client in `apps/api/src/generated/prisma` (git-ignored, also generated
on `npm install`).

No email provider is connected yet: `MailService` logs each email, so OTP codes appear in the API's
terminal output.

### Auth

The access token (15 min) is returned in the JSON body and sent as `Authorization: Bearer <token>`.
The refresh token lives in an httpOnly cookie (`vol_rt` for the web app, `vol_admin_rt` for the admin
panel), so frontends must call the API with `credentials: "include"`. Every route requires a valid
token unless it's marked `@Public()`; restrict by role with `@Roles("ADMIN")`.

| Screen                      | Endpoint                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Sign up → OTP               | `POST /auth/signup` → `POST /auth/verify-email`                                                  |
| Resend code                 | `POST /auth/resend-verification`                                                                 |
| Login                       | `POST /auth/login` (403 `EMAIL_NOT_VERIFIED` also sends a fresh code)                            |
| Forgot → OTP → reset        | `POST /auth/forgot-password` → `POST /auth/forgot-password/verify` → `POST /auth/reset-password` |
| Join network                | `PATCH /users/me` with `{ accountType }`                                                         |
| Create profile / visibility | `PUT /users/me/profile`, `PUT /users/me/business`                                                |
| Finish onboarding           | `POST /users/me/complete-onboarding`                                                             |
| Admin sign-in → verify      | `POST /auth/admin/login` → `POST /auth/admin/verify`                                             |
| Stay signed in / sign out   | `POST /auth/refresh`, `POST /auth/logout` (admin: `/auth/admin/refresh`, `/auth/admin/logout`)   |

## Deploying on Vercel

Each app is its own Vercel project pointing at this same repository:

| Vercel project | Root Directory |
| -------------- | -------------- |
| web            | `apps/web`     |
| admin          | `apps/admin`   |

In each project, turn on "Skip deployments when there are no changes to the root directory or its
dependencies" so a change to one app doesn't redeploy the other (changes to `packages/ui` redeploy
both).

## Admin data

The admin screens run on placeholder data in `apps/admin/src/lib/mock-data.ts` and
`apps/admin/src/lib/settings.ts`. Replace those with API calls once the backend exists; the pages
only depend on the shapes exported there.

## Troubleshooting

If Tailwind classes from a newly added file don't show up in `next dev`, stop the dev server,
delete that app's `.next` folder and start it again.
