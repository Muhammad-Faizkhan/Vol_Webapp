# VÔL Network Web App — Build Handoff

Status as of this session: **31 of 39 Figma screens built and pixel-verified**. This doc lets a fresh Claude Code session (different account/machine) pick up exactly where this one left off.

## Source of truth

- Figma file: `https://www.figma.com/design/U0ViacZ05fpboMsZI0c6X5/Vol-Web-App`
- Figma file key: `U0ViacZ05fpboMsZI0c6X5`
- Reference prototype: `reference/dc.html` (rough draft, 39 screens — use for copy/component-boundary cross-check only; Figma is the source of truth for exact layout/spacing/colors)
- Original kickoff brief: the user has `claude-code-kickoff-prompt.md` (not copied into the repo) — it lists all 39 screens with node IDs, grouped by flow, plus the fidelity checklist and scope notes reproduced below.

## Tech stack (already scaffolded, do not change)

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- State: React Context (none needed yet — everything so far is static/mock)
- Data: mock data only, inline in each page — no backend wiring

## Required workflow for every remaining screen

1. Load the `figma-design-to-code` skill guidance (fetch via `ReadMcpResourceTool` on `skill://figma/figma-design-to-code/SKILL.md` if the skill isn't auto-loaded) before calling `get_design_context`.
2. For a screen this complex, prefer `get_screenshot` (cheap, one image, maxDimension ~1500) over `get_design_context`'s full JSX dump — the JSX for a real screen is often 50–100KB and mostly restates values you can read off the screenshot. Only pull `get_design_context` for a screen when you need exact copy text, exact spacing you can't eyeball, or new asset URLs.
3. Reuse the existing component library (list below) instead of one-off markup. Check it before writing new JSX.
4. Download any new icon/illustration assets via `curl` into `public/icons/` or `public/illustrations/`, referencing the asset URLs Figma returns (they expire in ~7 days, so download immediately, don't leave remote URLs in code).
5. **Restart the dev server before screenshotting any brand-new route.** See "Known environment issues" below — this is not optional, it silently serves stale/incomplete CSS otherwise.
6. Screenshot the built page with Playwright at viewport 1920×1080 and visually diff against the Figma screenshot before moving on.

## Known environment issues (discovered this session — don't re-debug these)

1. **New route files need a dev-server restart to get their Tailwind classes compiled.** Editing an existing file hot-reloads fine; adding a brand-new `page.tsx`/`layout.tsx` sometimes doesn't get scanned until the server restarts. Symptom: classes silently missing from the compiled CSS (`grep` the served `/_next/static/chunks/[root-of-the-server]*.css` for the class name to confirm) even though the page returns 200. Fix: kill and restart `npm run dev` before screenshotting a new route.
2. **`lsof` doesn't reliably work in this Windows Git Bash environment for killing the dev server.** Use this instead:
   ```bash
   PID=$(netstat -ano | grep ":3000" | grep LISTENING | head -1 | awk '{print $5}')
   taskkill //PID $PID //F
   sleep 2
   cd "C:\Users\123\Projects\webapp" && (npm run dev > /tmp/nextdev.log 2>&1 &) && timeout 40 bash -c 'until curl -sf http://localhost:3000/login >/dev/null 2>&1; do sleep 1; done' && echo READY
   ```
3. **Some plain numeric Tailwind utilities silently fail to compile** — confirmed missing: `gap-16`, `grid-cols-12`, `col-span-8`, `col-span-4`, `divide-y` (used with `divide-{color}`). Workaround used throughout: arbitrary-value gaps (`gap-[62px]`) instead of the numeric scale past ~10, and flexbox (`flex`, `flex-[2]`/`flex-[1]`, manual `border-t` per row) instead of CSS Grid utilities. Arbitrary bracket values (`gap-[50px]`, `w-[300px]`, etc.) have been reliable throughout — prefer them over the plain numeric scale if a class seems to not apply.
4. **A color token whose name contains the literal substring "border" breaks when combined with a Tailwind opacity modifier.** `border-light-border` alone works; `border-light-border/30` silently resolves to a default black border. Workaround: use the literal `rgba(...)` value in an arbitrary class instead, e.g. `border-[rgba(198,198,205,0.3)]` (this also happens to match Figma's own literal output in most cases, so no fidelity loss).
5. Playwright is installed as an ad-hoc devDependency (`npm install --no-save playwright`, plus a global browser install) purely for screenshot verification — it is **not** in `package.json`/`package-lock.json` and shouldn't be added there; reinstall the same way (`npm install --no-save playwright`, then `npx playwright install chromium`) in a fresh clone/session if screenshot tooling is needed again. Use the CLI directly rather than a custom script where possible: `npx playwright screenshot --viewport-size=1920,1080 --wait-for-timeout=800 "<url>" "<out.png>"`.
6. Figma's `get_design_context` sometimes silently omits a sub-tree of a large screen (observed: the shared `AppHeader` was missing from the Home dashboard's JSX dump even though it's visible in the screenshot). If a visible UI element is missing from the JSX, use `get_metadata` on the parent frame to find the node by name, then call `get_design_context` on that specific node ID directly.
7. Some Figma-exported icon assets are flattened to a single fill color matching whatever state they appeared in on the specific frame you pulled them from (e.g. sidebar icons come back navy if the nav item was active on that frame, white if inactive). Don't reuse one icon file across active/inactive states — either pull both states from Figma, or (what was done here) generate the other color variant locally via a `sed` fill/stroke swap on the SVG, since the shape is identical.

## Component library (reuse these — don't rebuild)

| Component | Path | Notes |
|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | `variant="primary"` (filled slate, used for main CTAs) or `variant="outline"` (OAuth-style, icon+label) |
| `TextField` | `src/components/ui/TextField.tsx` | Bordered input with optional leading icon, matches auth-screen input style |
| `Checkbox` | `src/components/ui/Checkbox.tsx` | |
| `Toggle` | `src/components/ui/Toggle.tsx` | Pill switch, used in Network Visibility |
| `OtpInput` | `src/components/ui/OtpInput.tsx` | Client component, 6-digit auto-advance |
| `Modal` | `src/components/ui/Modal.tsx` | Generic overlay + centered box shell, `maxWidth` prop |
| `AuthShell` | `src/components/auth/AuthShell.tsx` | Shared navy/white split-pane layout for every `(auth)` screen. Props: `backHref`, `showBack`, `contentWidth` (570 default, 652 for wider forms). Content is vertically pinned at `top-120px` (not centered) — this matches Figma's actual measurements across every auth screen checked. |
| `RoleCard` | `src/components/auth/RoleCard.tsx` | Light-theme role-selection card (Individual/Business) |
| `WorkspaceCard` | `src/components/cards/WorkspaceCard.tsx` | `variant="wide"` (460px, footer avatar stack, used on Home) or `variant="grid"` (300px, meta lines, used everywhere else) |
| `ClassCard` | `src/components/cards/ClassCard.tsx` | Optional `tag` + `progress` props for the "Active Classroom" progress-bar variant vs. the plain modules-count variant |
| `FeedPostCard` | `src/components/cards/FeedPostCard.tsx` | Full Discover-feed post card |
| `Sidebar` | `src/components/layout/Sidebar.tsx` | Client component (uses `usePathname`). Nav icon files are named `<name>.svg` (inactive/white) and `<name>-active.svg` (navy) — see gotcha #7 above before adding new nav items |
| `AppHeader` | `src/components/layout/AppHeader.tsx` | Fixed top bar: search + bell + avatar |
| `MembersPanel` | `src/components/workspace/MembersPanel.tsx` | `showManageRoles` prop |
| `ActivityPanel` | `src/components/workspace/ActivityPanel.tsx` | `showFullAuditTrail` prop (1 item vs 3 + "See Full Audit Trial" button) |

## Route map / layout structure

- `(auth)` route group: full-bleed `AuthShell`-based screens, dark `#111` backdrop wrapper (`src/app/(auth)/layout.tsx`)
- `(app)` route group: authenticated shell — `Sidebar` + `AppHeader` + scrollable main (`src/app/(app)/layout.tsx`)
- `(canvas)` route group: full-bleed canvas editor, own header, no sidebar (`src/app/(canvas)/canvas/[canvasId]/page.tsx` and `.../discover-canvas/[postId]/page.tsx`)
- `workspaces/[id]/(tabs)/` — nested route group so the Canvases/Files/Members tab bar wraps only those three tabs, **not** `workspaces/[id]/invite` (that's a sibling outside `(tabs)`, deliberately — the Figma Invite screen has no tab bar). If you add more workspace-detail sub-pages that shouldn't show tabs, keep them as siblings of `(tabs)`, not inside it.
- Design tokens live in `src/app/globals.css` under `:root` + `@theme inline` (maps to `bg-auth-navy`, `text-auth-slate`, `border-light-border`, `bg-dak-bg`, etc. — see file for the full list, all ported from `reference/dc.html`'s CSS custom properties).

## Screens completed (26)

**Auth flow (5/5):** Login, Sign Up, OTP Verification, Forgot Password, Reset Password
**Role selection (2/2):** Join Network light (`/join-network`), Join Network dark (`/join-network-dark`)
**Onboarding (2/2):** Create Personal Profile (`/create-profile`), Network Visibility (`/network-visibility`)
**Home/Workspace flow (8/9 — Activity+Visibility merged into Members tab per kickoff note):**
`/home`, `/workspaces`, `/workspaces/[id]/canvases`, `/workspaces/[id]/files`, `/workspaces/[id]/members` (includes the workspace Visibility settings section), `/canvas/[canvasId]`, `/workspaces/create`, `/workspaces/[id]/invite`
**Discover flow (5/5):** `/discover`, `/discover/post/[postId]`, `/discover/create-post`, `/discover/select-canvas`, `/discover-canvas/[postId]`
**Explore/Classrooms/Business (7/7 — all done):** `/explore`, `/classrooms`, `/classrooms/[classroomId]`, `/classrooms/manage`, `/business/dashboard`, `/profile`, `/profile/edit` + `/profile/edit-business` (share `ProfileOverview` component with a `persona` prop)

## Screens remaining (8) — with Figma node IDs

### Creation flows (5 left)
- Add New Product (multi-step: Identity → Specs → Review) — node `154:2`
- Edit Product — node `157:846`
- Create Classroom (course identity form) — node `157:4705`
- Create Module (curriculum/lesson builder) — node `162:5494`
- Curriculum Builder (module overview, step 2 of classroom creation) — node `160:4973`

Note: the kickoff brief's original 39-screen count included some screens this session judged redundant with what was already built (e.g. Workspace Activity+Visibility were merged into the Members & Roles tab per the brief's own instruction to "split into logical sections" rather than a literal 1:1 screen). If the 39 count needs to reconcile exactly, double check against `claude-code-kickoff-prompt.md`'s full list before assuming these 8 are the only gap.

### New components built this batch (in addition to the earlier list)
- `ClassCard` (`src/components/cards/ClassCard.tsx`) — optional `tag` + `progress` props for the "Active Classroom" progress-bar variant vs. the plain modules-count variant
- `ProductCard` (`src/components/cards/ProductCard.tsx`) — **fixed width `w-[300px]`, not `flex-1`** — a `flex-1` product/class/workspace card inside a `flex flex-wrap` container will NOT wrap into even rows once there are more items than fit one row (it just shrinks every card to fit one line); always give these grid-card components a fixed pixel width and let `flex-wrap` do the wrapping, per the pattern already used in `WorkspaceCard`/`ClassCard`.
- `ProfileOverview` (`src/components/profile/ProfileOverview.tsx`) — shared Edit-Profile-view component, `persona: "individual" | "business"` prop, per the kickoff brief's "handle business persona with a variant prop, not duplicate pages" instruction

### Suggested route paths for the remaining screens (not yet created)
- `/business/products/add` — Add New Product
- `/business/products/[productId]/edit` — Edit Product
- `/classrooms/create` — Create Classroom
- `/classrooms/create/curriculum` — Curriculum Builder
- `/classrooms/[classroomId]/modules/create` — Create Module

## Fidelity checklist (per the kickoff brief — apply to every remaining screen)

- Exact spacing/padding values (not "close enough")
- Exact font sizes/weights/family (Inter for auth/app screens, Geist for dashboard headings — `font-heading` Tailwind class maps to Geist)
- Exact color values (use the design tokens, not fresh hex guesses)
- Real routing — every card/button that should navigate does, via `next/link`
- Desktop-only for now (1920×1080) — mobile/responsive is explicitly out of scope per the kickoff brief unless the user asks
- No real backend — mock data matching Figma placeholder content ("Lorem Ipsum Workspace" etc.)
- Business-persona duplicate screens should reuse individual-flow components with a persona prop/variant, not be duplicated wholesale (relevant for Edit Profile business vs individual, Profile business)

## How to resume in a new session

1. Open this repo in Claude Code, confirm Figma MCP access (`whoami` should return the same account).
2. Read this file, then `reference/dc.html` if screen-specific copy/structure needs cross-checking.
3. Pick the next unbuilt screen from "Screens remaining" above, follow the workflow section, and keep updating this file's "Screens completed" / "Screens remaining" lists as you go so the next handoff stays accurate.
