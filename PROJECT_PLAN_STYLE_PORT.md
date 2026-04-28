# PROJECT PLAN — Style Port from `full-project`

**Project:** urban-space (Next.js + next-intl + Prisma)
**Source:** `../full-project` (Vite + React + react-router)
**Status:** Planning
**Created:** 2026-04-28
**Last Updated:** 2026-04-28

---

## 1. Overview

Port the **visual style only** of two pieces from `full-project` into `urban-space`, while keeping the existing data layer (Prisma), routing (Next.js App Router), and i18n (next-intl) untouched.

### Scope

| # | Target file (urban-space) | Source style (full-project) | What changes |
|---|---------------------------|------------------------------|--------------|
| 1 | `src/components/home/SelectedWork.tsx` | `src/components/Projects.tsx` | Layout, typography, colors, spacing, card chrome |
| 2 | `src/components/projects/ProjectsClient.tsx` | `src/pages/ProjectsPage.tsx` | Two-column grid grouped by category, anchor sections, no top filter bar |

### Out of Scope

- Header / footer / navigation (urban-space already has `ProjectsLayout.tsx`)
- Routing changes (no new pages, no `react-router`)
- Data sources (keep Prisma queries in `app/[locale]/projects/page.tsx`)
- i18n keys (reuse existing `home.featured.*` and `navigation.*`)
- Mock/static project data

---

## 2. Decisions Captured (from clarification)

| Decision | Choice |
|----------|--------|
| Card "Architecture/Urban" badge on home `SelectedWork` | **Drop it** — match full-project's clean image+title+meta cards |
| `/projects` default view (no `?category=`) | **Show both** Architecture and Urban groups on one page |
| `/projects` top filter buttons | **Drop them** — navigation handles category links |

`?category=ARCHITECTURE` / `?category=URBAN` will still filter down to a single group; without the param, both render.

---

## 3. Visual Spec — Section 1: Home `SelectedWork`

Adopted from `full-project/src/components/Projects.tsx`.

### Container
- Background: `bg-[#F2F2F2]`
- Padding: `px-3 py-24 md:px-4 md:py-32`
- Max width: `mx-auto max-w-[1920px]`
- Section id: `selected-work` (anchor target)

### Header block (left-aligned, no right-alignment)
- Eyebrow: `text-[18px] md:text-[26px] uppercase tracking-[0.2em] text-[#777777] font-light`
  - Source string: `t('home.featured.badge')` → "Featured Work" / "შერჩეული ნამუშევრები" (existing key reused for eyebrow)
- Title: `mt-4 font-light tracking-[0.06em] text-[#222222]`
  - Locale-conditional sizing: `ka → text-[22px] md:text-[34px]`, `en → text-[28px] md:text-[44px]`
  - Source string: `t('home.featured.title')`
- Drop: existing right-aligned subtitle block (or fold subtitle into eyebrow line if user wants both)

### Grid stack (`flex flex-col gap-16 md:gap-24`)

**Row A — first 3 projects:** `grid gap-8 md:grid-cols-3 md:gap-8`
- Card wrapper: `<Link>` with `group block`
- Image box: `overflow-hidden h-[368px] md:h-[495px] bg-black/5`
- Image: `w-full h-full object-cover object-center transition duration-700 group-hover:scale-[1.02]`
- Meta block (`mt-5`):
  - Title: `text-[20px] md:text-[26px] font-light text-[#222222]`
  - Subtitle: `mt-1 text-[#777777]` → `{location}` (no badge)

**Row B — next 2 projects:** `grid gap-8 md:grid-cols-2 md:gap-12 md:px-4`
- Image box height: `h-[391px] md:h-[598px]`
- Same meta block as Row A

### Drops (vs current `SelectedWork.tsx`)
- Drop `min-h-screen flex flex-col justify-center` container — replaced by full-project padding
- Drop `bg-white` — replaced with `bg-[#F2F2F2]`
- Drop `border-t border-gray-200 ... bg-gray-100 px-... py-...` boxed-meta block
- Drop `<span>` Architecture badge
- Drop right-aligned heading layout

### Preserved
- `next/image` usage (replace `<img>` from full-project)
- `Link` from `@/i18n/routing`
- `useLocale` + `useTranslations` for i18n
- `projects.slice(0, 3)` / `slice(3, 5)` split
- `content?.[key]?.[locale]` override mechanism
- Image fallback chain: `featuredImage → pages?.[0]?.image1 → '/poto/2.webp'`

---

## 4. Visual Spec — Section 2: `/projects` Page (`ProjectsClient`)

Adopted from `full-project/src/pages/ProjectsPage.tsx`.

### Outer section
- Wrapper: `<section className="px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">`
- Inner: `<div className="mx-auto max-w-[1680px]">`
- (No filter button bar above — dropped)

### Group rendering
For each non-empty group:

```tsx
<section id={id} className="mb-20 scroll-mt-28 md:mb-24">
  <div className="mb-8 md:mb-10">
    <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/45 md:text-sm">
      {label}
    </h2>
  </div>
  <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 md:gap-y-24 xl:gap-x-8 xl:gap-y-28">
    {projects.map(...)}
  </div>
</section>
```

### Card (`<article>`)
- Image box: `overflow-hidden bg-foreground/5 aspect-[4/3]`
- Image: `next/image` with `fill`, `className="object-contain transition duration-700 group-hover:scale-[1.015]"`
- Meta (`pt-4 md:pt-5`):
  - Title: `text-[18px] font-light tracking-[0.03em] text-foreground/90 md:text-[22px]`
  - Location: `mt-1 text-sm text-foreground/55 md:text-base`

### Anchor IDs & labels
- `id="architecture"` for Architecture group, label = `labels.architecture` (next-intl)
- `id="urban"` for Urban group, label = `labels.urban`
- `scroll-mt-28` so sticky `ProjectsLayout` header doesn't overlap when linking to `#architecture` / `#urban`

### Filter logic (data fetching change in `app/[locale]/projects/page.tsx`)
Currently the page forces a single category. To support "show both" default:

```ts
const cat = searchParams.category;
const where = cat === 'URBAN' ? { category: 'URBAN' as ProjectCategory }
            : cat === 'ARCHITECTURE' ? { category: 'ARCHITECTURE' as ProjectCategory }
            : {}; // both
```

Then in `ProjectsClient`:
- Split `projects` into `architectureProjects` / `urbanProjects`
- `showArchitecture = !filter || filter === 'ARCHITECTURE'`
- `showUrban = !filter || filter === 'URBAN'`

### Drops (vs current `ProjectsClient.tsx`)
- Drop top filter button bar (lines 37–51)
- Drop staggered two-column variable-height layout (`leftHeights` / `rightHeights`)
- Drop `framer-motion` `AnimatePresence` wrapper around column switch
- Drop `ProjectCardMinimal` (replaced by inline card markup matching full-project)
- Drop `useRouter().push('/projects?category=...')` filter handler

### Preserved
- `'use client'` directive
- `useLocale` for locale-aware titles
- `Project & { pages?: { image1 }[] }` type
- Empty state message (Georgian "პროექტები არ მოიძებნა" — keep)
- `ProjectsLayout.tsx` is untouched (header, language switcher, mobile menu all stay)

---

## 5. Phases & Tasks

### Phase 1 — Home Section Style Port

#### T1.1: Restyle `SelectedWork.tsx` container & header
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - Replace outer wrapper with `bg-[#F2F2F2] px-3 py-24 md:px-4 md:py-32` + `max-w-[1920px]` + `id="selected-work"`
  - Replace right-aligned heading with left-aligned eyebrow + title using full-project typography
  - Map eyebrow to `t('home.featured.badge')`, title to `t('home.featured.title')` with locale-conditional sizing for Georgian

#### T1.2: Restyle `SelectedWork.tsx` 3-up + 2-up grids
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T1.1
- **Description**:
  - Replace meta block (boxed bg-gray-100) with full-project's image-then-title-then-location layout
  - Drop Architecture/Urban badge `<span>`
  - Apply Row A heights (`368px / md:495px`) for first 3, Row B heights (`391px / md:598px`) for last 2
  - Switch image to `next/image` with `fill`, keep `object-cover`, `group-hover:scale-[1.02]`, transition 700ms

#### T1.3: Verify home page renders correctly in `en` and `ka`
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T1.2
- **Description**:
  - Run `bun run dev` (or `npm run dev`)
  - Visit `http://localhost:3000/en` and `http://localhost:3000/ka`
  - Check eyebrow + title sizing per locale, image aspect, hover scale, link → `/projects/{slug}`

---

### Phase 2 — `/projects` Page Style Port

#### T2.1: Update `app/[locale]/projects/page.tsx` to support "no filter" default
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - Change category resolution from "default to ARCHITECTURE" to "if param missing, fetch all"
  - Pass through `initialCategory: 'ALL' | 'ARCHITECTURE' | 'URBAN'` to client

#### T2.2: Rewrite `ProjectsClient.tsx` with full-project layout
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T2.1
- **Description**:
  - Drop top filter button bar
  - Drop `framer-motion` wrapper, `leftHeights/rightHeights`, `ProjectCardMinimal` import
  - Split `projects[]` into `architectureProjects` / `urbanProjects`
  - Render conditionally based on `initialCategory` (both when ALL)
  - Build `ProjectGroup` inline component with `id`, `scroll-mt-28`, uppercase eyebrow label, 2-col grid
  - Build inline `<article>` card matching full-project markup, using `next/image` `fill` + `object-contain`
  - Keep "პროექტები არ მოიძებნა" empty state when both groups empty

#### T2.3: Verify `/projects` route end-to-end
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T2.2
- **Description**:
  - `http://localhost:3000/en/projects` → both groups stacked
  - `http://localhost:3000/en/projects?category=ARCHITECTURE` → only Architecture group
  - `http://localhost:3000/en/projects?category=URBAN` → only Urban group
  - `http://localhost:3000/en/projects#architecture` and `#urban` anchors scroll correctly under sticky header
  - `ka` locale renders Georgian labels via `labels.architecture` / `labels.urban`
  - `ProjectsLayout` header still works (logo, nav, language switcher, mobile menu)

---

### Phase 3 — Cleanup & Hand-off

#### T3.1: Remove unused code
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T2.3
- **Description**:
  - If `ProjectCardMinimal.tsx` is now unreferenced anywhere → delete it
  - Remove `framer-motion` imports from `ProjectsClient` (already gone in T2.2)
  - Quick `grep -r ProjectCardMinimal src/` to confirm no other callers

#### T3.2: Visual diff against `full-project` (`localhost:5173` vs `localhost:3000`)
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T2.3
- **Description**:
  - Side-by-side compare home `Selected Work` and `/projects` page in both locales
  - Adjust spacing/font-weight/colors if any drift from source

---

## 6. Risks & Notes

| Risk | Mitigation |
|------|------------|
| `next/image` with `object-contain` may letterbox tall images on `aspect-[4/3]` boxes | Match full-project intent — they use `object-contain` deliberately. If user prefers `object-cover` later, single-line change. |
| `bg-foreground/5` and `text-foreground/45` rely on Tailwind's `foreground` token | Already defined in urban-space `tailwind.config.ts` (verify in T2.2) — fall back to `bg-black/5` / `text-black/45` if not present |
| Eyebrow uses existing `home.featured.badge` (which reads "Featured Work" / "შერჩეული ნამუშევრები") | If user wants the literal full-project copy "SELECTED WORK" / "შერჩეული ნამუშევრები", swap the i18n key in T1.1 |
| Image fallback path `/poto/2.webp` is urban-space-specific | Keep — full-project asset imports don't apply in Next.js |

---

## 7. Acceptance Criteria

- [ ] `/en` and `/ka` home page "Selected Work" matches full-project's `Projects.tsx` visual layout
- [ ] No "Architecture" badge appears on home cards
- [ ] `/en/projects` (no query param) renders both Architecture and Urban groups stacked, with anchor IDs
- [ ] No top filter button bar on `/projects`
- [ ] `?category=ARCHITECTURE` / `?category=URBAN` still filter correctly
- [ ] Existing header (`ProjectsLayout`), language switcher, mobile menu unchanged
- [ ] No regressions in admin pages, project detail pages, or other routes
