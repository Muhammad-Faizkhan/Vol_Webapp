# VÔL

npm workspaces monorepo with two Next.js apps that share brand tokens.

```
apps/web     user-facing app (port 3000)
apps/admin   admin dashboard (port 3001)
packages/ui  shared brand tokens (@vol/ui/tokens.css)
```

## Getting started

Install once from the repo root, then run either app:

```bash
npm install
npm run dev:web     # http://localhost:3000
npm run dev:admin   # http://localhost:3001
```

`npm run build:web` / `npm run build:admin` build each app; `npm run lint` lints both.

To add a dependency to one app: `npm install <pkg> -w admin` (or `-w web`).

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
