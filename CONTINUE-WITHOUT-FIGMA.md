# Continuing this project from an account without Figma access

This repo has been built almost entirely by matching a Figma file screen-by-screen via the Figma
MCP server. If you're picking this up from a Claude account/session that does **not** have that
MCP server connected, read this first — it tells you what you can and can't do, and how to get
unblocked instead of guessing.

## Read this first

1. **`HANDOFF.md`** is the full build history and source of truth — architecture, design tokens,
   component library, environment gotchas, and a dated log of every fix made so far. Read it in
   full before touching anything; it documents several non-obvious traps (duplicate near-identical
   page files, Tailwind classes that silently fail to compile, a hydration-mismatch pattern, etc.)
   that you will otherwise rediscover the hard way.
2. This file only adds: what changes if you don't have Figma access.

## What "no Figma access" actually blocks

You cannot call `get_design_context`, `get_screenshot`, `get_metadata`, or `download_assets`
against file key `U0ViacZ05fpboMsZI0c6X5`. That means you cannot independently verify exact
spacing/color/copy against the design source of truth for any screen — built or unbuilt.

**You do NOT need Figma to**:
- Fix bugs in already-built screens (routing, dead buttons, broken state, responsive overflow,
  hydration errors, etc.) — the existing code + `HANDOFF.md`'s conventions are enough.
- Build the 8 remaining screens at a rough-draft level of fidelity — `reference/dc.html` (see
  below) has working markup/copy for all of them.
- Keep visual consistency with the rest of the app — the design tokens, component library, and
  patterns documented in `HANDOFF.md` (colors, spacing scale, card components, viewport-fluid
  `clamp()` conventions) are already extracted from Figma and don't require re-fetching.

**You DO need Figma access (or the user) to**:
- Get pixel-exact spacing/colors/copy for the 8 unbuilt screens, or to verify a rebuilt screen
  matches Figma exactly rather than approximately.
- Confirm anything HANDOFF.md flags as "not yet checked against Figma" or "reasonable
  placeholder, no Figma frame found for this state" (search HANDOFF.md for those phrases —
  there are a couple of genuine gaps already called out, e.g. the Workspaces "Add by Business
  Profiles" tab content).

## What's already built (27 screens) vs. remaining (8 screens)

See `HANDOFF.md`'s "Screens completed" / "Screens remaining" sections for the authoritative,
maintained lists — don't duplicate them here since they'll drift. As of this handoff, the 8
remaining are all creation/builder flows:

- Add New Product (multi-step: Identity → Specs → Review) — Figma node `154:2`
- Edit Product — Figma node `157:846`
- Create Classroom (course identity form) — Figma node `157:4705`
- Create Module (curriculum/lesson builder) — Figma node `162:5494`
- Curriculum Builder (step 2 of classroom creation) — Figma node `160:4973`

The node IDs are listed for when Figma access *is* available again — they're not usable without
the MCP server.

## Building the remaining screens without Figma

`reference/dc.html` (a single-file rough-draft prototype covering all 39 original screens) already
has working markup and placeholder copy for all 5 remaining screens. Search it for these anchor
IDs to find each one:

- `#s-add-product` — Add New Product
- `#s-edit-product` — Edit Product
- `#s-create-classroom` — Create Classroom
- `#s-create-module` — Create Module (curriculum builder)
- `#s-curriculum-builder` — Curriculum Builder (step 2)

Treat `reference/dc.html` as a **structure and copy** reference only, not a visual one — per
`HANDOFF.md`, it's a low-fidelity draft and the real app's spacing/colors/components diverge from
it in most places (this is exactly the mistake an earlier session made against the wrong Figma
page — don't repeat it against the wrong reference file). Concretely:

1. Read the relevant `#s-...` section in `dc.html` for field lists, step structure, and copy text.
2. Rebuild it using this app's real design tokens and existing components — reuse `Button`,
   `TextField`, `Checkbox`, `Stepper` (already built for the Add-Product multi-step flow's step
   indicator, check `src/components/ui/Stepper.tsx`), `Modal`, etc. from the component library
   table in `HANDOFF.md`. Match the visual language of already-built sibling screens (e.g. Add New
   Product and Edit Product should look like siblings of the Business dashboard/Product card
   screens already built; Create Classroom/Create Module/Curriculum Builder should look like
   siblings of the already-built Classrooms flow).
3. Follow the "Required workflow" and "Fidelity checklist" sections in `HANDOFF.md` for everything
   that doesn't depend on Figma access (viewport-fluid `clamp()` treatment, responsive breakpoints,
   real routing, dark mode, component reuse).
4. **Explicitly tell the user, in your own summary when you finish a screen, that it was built from
   `reference/dc.html` + design-system conventions rather than verified against Figma** — so a
   later session (or the user) knows to spot-check it against the real Figma frame before
   considering it done, the same way the placeholder-content flags elsewhere in `HANDOFF.md` work.

If the user is present and can paste a Figma screenshot or the exact `get_design_context` output
for one of these node IDs (asking them to run it from a session that *does* have Figma access, or
just to export/paste a screenshot from Figma directly), use that in preference to `dc.html` — it's
the real source of truth whenever available.

## Everything else (bug fixes, polish, responsiveness)

No Figma access is needed for this — just follow `HANDOFF.md`'s environment gotchas and
verification workflow (`npm run lint` → `npm run build` → restart dev server → Playwright check at
multiple viewports/both themes). This is most of what the last several sessions actually did:
fixing dead buttons, wrong default tabs, missing responsive behavior, a stale duplicate page file,
and a React hydration mismatch — all diagnosed and fixed from the code and browser behavior alone,
without needing to re-open Figma.
