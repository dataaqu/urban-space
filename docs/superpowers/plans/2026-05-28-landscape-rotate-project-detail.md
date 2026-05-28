# Landscape/Rotate Project Detail Layout Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop CLOSE / pagination dots / images from overlapping and shrink the oversized page-1 text on rotated phones (landscape), without altering portrait mobile or desktop.

**Architecture:** All changes are additive `short-landscape:` Tailwind utilities on existing class lists in a single component. The `short-landscape` screen (`(orientation: landscape) and (max-height: 600px)`) is declared *after* `md` in `tailwind.config.ts`, so its generated CSS comes later and overrides the inherited `md:` values on a rotated phone — while leaving portrait (<768) and desktop (≥1024) untouched.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS 3.4. No config change required (the `short-landscape` variant already exists).

**Spec:** `docs/superpowers/specs/2026-05-28-landscape-rotate-project-detail-design.md`

**Verification note:** This is a CSS-only change and the repo has no component test runner, so each task is verified visually in the browser at a rotated-phone viewport. There are no unit tests to write.

---

## File Structure

Single file modified:

- Modify: `src/components/projects/ProjectDetailClient.tsx` — the only component rendering the project detail slide stage, CLOSE link, pagination dots, image stage, page-1 title/subtitle, and info button.

No files created. No config changed.

---

### Task 1: Separate CLOSE and pagination dots (no mutual overlap)

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx:206-212` (CLOSE `<Link>`)
- Modify: `src/components/projects/ProjectDetailClient.tsx:215-216` (pagination dots wrapper)

- [ ] **Step 1: Pin CLOSE to the top-right on rotated phones**

In the close `<Link>`, the current `className` is:

```
fixed right-4 top-[72px] md:right-8 md:top-[130px] z-20 text-[10px] md:text-[12px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition
```

Add `short-landscape:top-[64px]` so it overrides the inherited `md:top-[130px]` (which lands mid-screen). New `className`:

```
fixed right-4 top-[72px] md:right-8 md:top-[130px] short-landscape:top-[64px] z-20 text-[10px] md:text-[12px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition
```

- [ ] **Step 2: Center the pagination dots vertically on the right rail**

The current pagination dots wrapper `className` is:

```
fixed right-4 md:right-6 top-[42%] -translate-y-1/2 -mt-10 z-30 flex flex-col gap-3
```

Add `short-landscape:top-1/2 short-landscape:mt-0` so the dots sit at true vertical center (overriding `top-[42%]` and the `-mt-10` upward nudge), clearly below CLOSE. New `className`:

```
fixed right-4 md:right-6 top-[42%] -translate-y-1/2 -mt-10 short-landscape:top-1/2 short-landscape:mt-0 z-30 flex flex-col gap-3
```

- [ ] **Step 3: Verify in the browser (landscape)**

Run: `npm run dev`
Open a project detail page, e.g. `http://localhost:3000/en/projects/<id>` (pick any project id from the projects list).
In DevTools device toolbar, set a rotated-phone viewport: **740 × 360** (landscape, height ≤ 600px).
Expected: `CLOSE` appears just under the header at top-right; the dots are centered on the right edge; CLOSE and the dots do **not** overlap.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: separate CLOSE and pagination dots in landscape project view"
```

---

### Task 2: Keep images clear of the right rail (no overlap with CLOSE/dots)

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx:242` (center-stack container)

- [ ] **Step 1: Add a right gutter to the center stack in landscape**

The current center-stack container `className` is:

```
flex h-full w-full flex-col items-center justify-start px-6 pt-[52px] pb-[calc(28px+env(safe-area-inset-bottom))] md:justify-start md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3
```

Add `short-landscape:pr-16` so the centered image group stops short of the right edge where CLOSE + dots live. New `className`:

```
flex h-full w-full flex-col items-center justify-start px-6 pt-[52px] pb-[calc(28px+env(safe-area-inset-bottom))] md:justify-start md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3 short-landscape:pr-16
```

- [ ] **Step 2: Verify in the browser (landscape, double-image page)**

With the dev server running and viewport at **740 × 360**, navigate to a page that has two images (a `DOUBLE_IMAGE` page — advance with the dots or arrow keys).
Expected: both images are centered and sit fully to the left of the right rail; neither `CLOSE` nor the dots overlap either image.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: add right gutter so landscape images clear the CLOSE/dots rail"
```

---

### Task 3: Shrink page-1 text and chrome labels so the cover image fits

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx:319-325` (`<h2>` title)
- Modify: `src/components/projects/ProjectDetailClient.tsx:327-334` (subtitle `<p>`)
- Modify: `src/components/projects/ProjectDetailClient.tsx:206-212` (CLOSE label — same `<Link>` as Task 1)
- Modify: `src/components/projects/ProjectDetailClient.tsx:347-349` (INFORMATION label `<span>`)

- [ ] **Step 1: Shrink the page-1 title**

The current `<h2>` className is built as:

```jsx
className={`font-light tracking-[0.04em] text-foreground/90 ${
  isKa ? 'text-[18px] md:text-[26px]' : 'text-[22px] md:text-[32px]'
}`}
```

Add `short-landscape:text-[16px]` to the static portion so it overrides both `md:` branches on a rotated phone:

```jsx
className={`font-light tracking-[0.04em] text-foreground/90 short-landscape:text-[16px] ${
  isKa ? 'text-[18px] md:text-[26px]' : 'text-[22px] md:text-[32px]'
}`}
```

- [ ] **Step 2: Shrink the page-1 subtitle and tighten its top gap**

The current subtitle `<p>` className is built as:

```jsx
className={`mt-3 md:mt-4 text-foreground/60 leading-relaxed max-w-[640px] ${
  isKa ? 'text-[12px] md:text-[14px]' : 'text-[14px] md:text-[16px]'
}`}
```

Add `short-landscape:mt-1 short-landscape:text-[11px]` to the static portion:

```jsx
className={`mt-3 md:mt-4 short-landscape:mt-1 text-foreground/60 leading-relaxed max-w-[640px] short-landscape:text-[11px] ${
  isKa ? 'text-[12px] md:text-[14px]' : 'text-[14px] md:text-[16px]'
}`}
```

- [ ] **Step 3: Shrink the CLOSE label**

On the same close `<Link>` from Task 1, add `short-landscape:text-[9px]` (it overrides the inherited `md:text-[12px]`). The `className` becomes (note the `short-landscape:top-[64px]` from Task 1 is already present):

```
fixed right-4 top-[72px] md:right-8 md:top-[130px] short-landscape:top-[64px] z-20 text-[10px] md:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition
```

- [ ] **Step 4: Shrink the INFORMATION label**

The current INFORMATION `<span>` className is:

```
text-[10px] md:text-[12px] font-light tracking-[0.22em] uppercase
```

Add `short-landscape:text-[9px]`:

```
text-[10px] md:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase
```

- [ ] **Step 5: Verify in the browser (landscape, page 1)**

With the dev server running and viewport at **740 × 360**, open page 1 (the cover) of a project. Check both locales (`/en/...` and `/ka/...`).
Expected: title, subtitle, the cover image, and the INFORMATION button all fit on screen; the cover image is a reasonable size (not squished to a sliver); CLOSE and INFORMATION read as small secondary chrome.

- [ ] **Step 6: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: shrink page-1 text and chrome labels in landscape project view"
```

---

### Task 4: Regression check — portrait mobile and desktop unchanged

**Files:** none (verification only)

- [ ] **Step 1: Verify portrait mobile is unchanged**

With the dev server running, set the viewport to **375 × 812** (portrait phone). Walk through a single-image page, a double-image page, and the cover page; open the info drawer.
Expected: layout is pixel-identical to before this change (no `short-landscape:` rule should match here, since height > 600px and orientation is portrait).

- [ ] **Step 2: Verify desktop is unchanged**

Set the viewport to **1440 × 900** (desktop). Walk through the same pages and open the info drawer.
Expected: layout is pixel-identical to before this change.

- [ ] **Step 3: Build to confirm no type/lint break**

Run: `npm run build`
Expected: build completes successfully with no new errors.

- [ ] **Step 4: Final confirmation**

Confirm against the spec acceptance criteria (`docs/superpowers/specs/2026-05-28-landscape-rotate-project-detail-design.md`): all overlap and sizing checks pass in landscape, portrait and desktop unchanged. No commit needed (verification-only task).
