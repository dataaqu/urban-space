# Unified Mobile + Tablet Project Detail Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the project detail page (`/[locale]/projects/[id]`) render with one identical, anchored layout for all devices below `lg` (mobile + tablet), so the photo is always centered, the CLOSE/INFO controls never move, and entering from any scroll position looks the same.

**Architecture:** The page already measures the visible viewport (`visualViewport`) to size the stage — that stays. We collapse the divergent `md:` content rendering into the `base` (`<lg`) rules so tablet inherits the mobile visual, and push the desktop-only switch to `lg:`. The photo stage becomes a single `flex-1` region with `next/image fill object-contain` (1 photo) or two stacked `flex-1` halves (2 photos). A new `switchAt` prop on `ResponsiveProjectImage` lets the detail page swap the mobile↔desktop source at `lg` instead of `md`, without affecting other pages.

**Tech Stack:** Next.js (App Router, `next/image`), React 18, Tailwind CSS.

**Verification note:** This is a pure layout/CSS change — there are no behavioral units to unit-test. Each task is verified with `npm run lint`, `npm run build`, and visual inspection in the browser device toolbar at the listed viewports. There is no test-runner step; do not fabricate one.

**Header context (do not change):** The site header is taller at `md` (logo `text-[15px]`→`md:text-[32px]`, subtitle `hidden md:block`, `py-4`→`md:py-5`). Because of this, `<main>`'s height (`md:h-[calc(100svh-80px)]`), the CLOSE button offset (`md:top-[130px]`), and the center column's paddings (`md:pt-6 md:pb-5`) legitimately differ between mobile and tablet to track the header. **These stay per-breakpoint.** Only the *content style* (justify mechanics, photo rendering, text/button sizing) is unified.

---

## File Structure

- **Modify:** `src/components/projects/ResponsiveProjectImage.tsx` — add optional `switchAt?: 'md' | 'lg'` prop (default `'md'`, additive — existing callers unchanged).
- **Modify:** `src/components/projects/ProjectDetailClient.tsx` — unify the `<lg` content layout (column justify, photo stage, text zone, info button); remove the now-unused `imgMaxH` state.

No new files. No changes to `SelectedWork.tsx`, `ProjectsClient.tsx`, the header, the drawer, slide navigation, or the `short-landscape:` rules.

---

## Task 1: Add `switchAt` prop to `ResponsiveProjectImage`

**Files:**
- Modify: `src/components/projects/ResponsiveProjectImage.tsx`

- [ ] **Step 1: Replace the component with the `switchAt`-aware version**

Current file:

```tsx
'use client';

import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  mobileSrc?: string | null;
};

export default function ResponsiveProjectImage({
  src,
  mobileSrc,
  className,
  alt,
  ...rest
}: Props) {
  if (!mobileSrc) {
    return <Image src={src} alt={alt} className={className} {...rest} />;
  }

  const cn = (extra: string) =>
    [extra, className].filter(Boolean).join(' ');

  return (
    <>
      <Image src={mobileSrc} alt={alt} className={cn('md:hidden')} {...rest} />
      <Image src={src} alt={alt} className={cn('hidden md:block')} {...rest} />
    </>
  );
}
```

Replace it with:

```tsx
'use client';

import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  mobileSrc?: string | null;
  /** Breakpoint at which the desktop `src` replaces `mobileSrc`. Default 'md'. */
  switchAt?: 'md' | 'lg';
};

export default function ResponsiveProjectImage({
  src,
  mobileSrc,
  className,
  alt,
  switchAt = 'md',
  ...rest
}: Props) {
  if (!mobileSrc) {
    return <Image src={src} alt={alt} className={className} {...rest} />;
  }

  const cn = (extra: string) =>
    [extra, className].filter(Boolean).join(' ');

  const hideMobile = switchAt === 'lg' ? 'lg:hidden' : 'md:hidden';
  const showDesktop = switchAt === 'lg' ? 'hidden lg:block' : 'hidden md:block';

  return (
    <>
      <Image src={mobileSrc} alt={alt} className={cn(hideMobile)} {...rest} />
      <Image src={src} alt={alt} className={cn(showDesktop)} {...rest} />
    </>
  );
}
```

- [ ] **Step 2: Verify existing callers are unaffected (default still `md`)**

Confirm `SelectedWork.tsx` and `ProjectsClient.tsx` call the component WITHOUT `switchAt` — so they keep the `md` switch byte-for-byte.

Run: `grep -n "switchAt" src/components/home/SelectedWork.tsx src/components/projects/ProjectsClient.tsx`
Expected: no output (no caller passes `switchAt`).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors in `ResponsiveProjectImage.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/ResponsiveProjectImage.tsx
git commit -m "feat: add switchAt prop to ResponsiveProjectImage (default md)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Anchor the center column and grow the photo stage on `<lg`

This makes the photo stage a `flex-1` region on mobile too (today only `md+` grows), and switches the column from "center the whole group" to "anchor from top, photo absorbs slack."

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx`

- [ ] **Step 1: Change the center column from `justify-center` to `justify-start`**

Find (around line 270):

```tsx
      <div className="flex h-full w-full flex-col items-center justify-center px-6 pt-[48px] pb-[calc(48px+env(safe-area-inset-bottom))] md:justify-start md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3 short-landscape:pr-16">
```

Replace with (base `justify-center` → `justify-start`; drop now-redundant `md:justify-start`; keep all paddings, which track the header):

```tsx
      <div className="flex h-full w-full flex-col items-center justify-start px-6 pt-[48px] pb-[calc(48px+env(safe-area-inset-bottom))] md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3 short-landscape:pr-16">
```

- [ ] **Step 2: Make the photo stage `flex-1` on `<lg`**

Find (around line 272):

```tsx
        <div className="relative flex w-full items-center justify-center shrink-0 min-h-0 md:h-auto md:flex-1 md:min-h-0 short-landscape:h-auto short-landscape:flex-1 short-landscape:min-h-0">
```

Replace with (base `shrink-0` → `flex-1`; drop redundant `md:h-auto md:flex-1 md:min-h-0`; keep `short-landscape:`):

```tsx
        <div className="relative flex w-full items-center justify-center flex-1 min-h-0 short-landscape:h-auto short-landscape:flex-1 short-landscape:min-h-0">
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: anchor detail column from top, grow photo stage on mobile

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Unify the single-image rendering across all breakpoints

Replace the mobile intrinsic `<img>` + separate `md/lg` fill with one `fill object-contain` container that uses the mobile source below `lg` and the desktop source at `lg+`.

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx`

- [ ] **Step 1: Replace the single-image branch**

Find (around lines 325–352, the `) : page.image1 ? (` branch up to the closing `)` before the `No image` fallback):

```tsx
          ) : page.image1 ? (
            <>
              {/* Mobile portrait: intrinsic image hugs its own (capped) height
                  so the stack centres with equal top/bottom gaps for any aspect. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`m-${activeIndex}`}
                src={page.mobileImage1 ?? page.image1}
                alt={project.title}
                style={imgMaxH ? { maxHeight: imgMaxH } : undefined}
                className="block h-auto w-auto max-w-full object-contain md:hidden short-landscape:hidden"
              />
              {/* Tablet / desktop / landscape: fill the flex stage (unchanged). */}
              <div
                key={`d-${activeIndex}`}
                className="relative hidden h-full w-full md:block short-landscape:block"
              >
                <ResponsiveProjectImage
                  src={page.image1}
                  mobileSrc={page.mobileImage1}
                  alt={project.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={activeIndex === 0}
                />
              </div>
            </>
          ) : (
```

Replace with (one container, mobile source `<lg` via `switchAt="lg"`, desktop source `lg+`):

```tsx
          ) : page.image1 ? (
            <div
              key={`d-${activeIndex}`}
              className="relative h-full w-full"
            >
              <ResponsiveProjectImage
                src={page.image1}
                mobileSrc={page.mobileImage1}
                alt={project.title}
                fill
                switchAt="lg"
                className="object-contain"
                sizes="100vw"
                priority={activeIndex === 0}
              />
            </div>
          ) : (
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors. (One `eslint-disable no-img-element` comment is removed with the `<img>` — that is correct.)

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: unify single-image detail rendering to one fill container

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Unify the two-image rendering — stacked `<lg`, side-by-side `lg+`

Today: mobile = intrinsic stacked `<img>`s; `md/lg/landscape` = side-by-side `fill`. After: `<lg` (mobile + tablet) = stacked `fill` halves; `lg+` and `short-landscape` = side-by-side (unchanged look, switch moved `md`→`lg`).

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx`

- [ ] **Step 1: Replace the two-image block**

Find (around lines 273–324, from `{hasTwoImages ? (` through the `</>` that closes it, i.e. just before `) : page.image1 ? (`):

```tsx
          {hasTwoImages ? (
            <>
              {/* Mobile portrait: each photo hugs its own size — no letterbox bands,
                  centered as a group, capped height so the pair never overflows. */}
              <div
                key={`m-${activeIndex}`}
                className="flex w-full flex-col items-center justify-center gap-3 md:hidden short-landscape:hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.mobileImage1 ?? page.image1}
                  alt={project.title}
                  style={imgMaxH ? { maxHeight: Math.round((imgMaxH - 12) / 2) } : undefined}
                  className="block h-auto w-auto max-w-full object-contain"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.mobileImage2 ?? (page.image2 as string)}
                  alt={project.title}
                  style={imgMaxH ? { maxHeight: Math.round((imgMaxH - 12) / 2) } : undefined}
                  className="block h-auto w-auto max-w-full object-contain"
                />
              </div>

              {/* Tablet / desktop / landscape: side-by-side, unchanged */}
              <div
                key={`d-${activeIndex}`}
                className="hidden md:flex short-landscape:flex md:flex-row short-landscape:flex-row h-full w-full items-center justify-center gap-6"
              >
                <div className="relative md:h-[84%] md:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image1}
                    mobileSrc={page.mobileImage1}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                    priority={activeIndex === 0}
                  />
                </div>
                <div className="relative md:h-[84%] md:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image2 as string}
                    mobileSrc={page.mobileImage2}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                  />
                </div>
              </div>
            </>
          ) : page.image1 ? (
```

Replace with (stacked `fill` halves `<lg`; side-by-side switch moved `md`→`lg`; landscape unchanged):

```tsx
          {hasTwoImages ? (
            <>
              {/* Mobile + tablet (<lg) portrait: stacked vertically, each half fills
                  and contains, so the pair centres identically on every device. */}
              <div
                key={`m-${activeIndex}`}
                className="flex h-full w-full flex-col items-center justify-center gap-3 lg:hidden short-landscape:hidden"
              >
                <div className="relative w-full flex-1 min-h-0">
                  <ResponsiveProjectImage
                    src={page.image1}
                    mobileSrc={page.mobileImage1}
                    alt={project.title}
                    fill
                    switchAt="lg"
                    className="object-contain"
                    sizes="100vw"
                    priority={activeIndex === 0}
                  />
                </div>
                <div className="relative w-full flex-1 min-h-0">
                  <ResponsiveProjectImage
                    src={page.image2 as string}
                    mobileSrc={page.mobileImage2}
                    alt={project.title}
                    fill
                    switchAt="lg"
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* Desktop (lg) + landscape: side-by-side, unchanged look */}
              <div
                key={`d-${activeIndex}`}
                className="hidden lg:flex short-landscape:flex lg:flex-row short-landscape:flex-row h-full w-full items-center justify-center gap-6"
              >
                <div className="relative lg:h-[84%] lg:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image1}
                    mobileSrc={page.mobileImage1}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                    priority={activeIndex === 0}
                  />
                </div>
                <div className="relative lg:h-[84%] lg:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image2 as string}
                    mobileSrc={page.mobileImage2}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                  />
                </div>
              </div>
            </>
          ) : page.image1 ? (
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: stack two-image detail vertically on mobile+tablet, side-by-side lg+

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Unify text zone + info button (move `md:` → `lg:`) and remove `imgMaxH`

The text zone and info button currently shrink at `md` (tablet). Move those overrides to `lg` so tablet matches mobile while desktop is preserved. Then remove the now-unused `imgMaxH` state (no caller remains after Tasks 3–4).

**Files:**
- Modify: `src/components/projects/ProjectDetailClient.tsx`

- [ ] **Step 1: Convert the title/description zone `md:` overrides to `lg:`**

Find (around lines 362–383):

```tsx
        <div className="mt-6 md:mt-5 short-landscape:mt-2 text-center shrink-0 min-h-[80px] md:min-h-[64px] short-landscape:min-h-0 flex flex-col items-center justify-start">
          {activeIndex === 0 && (
            <>
              <h2
                className={`font-light tracking-[0.04em] text-foreground/90 short-landscape:text-[16px] ${
                  isKa ? 'text-[18px] md:text-[26px]' : 'text-[22px] md:text-[32px]'
                }`}
              >
                {project.title}
              </h2>
              {project.description && (
                <p
                  className={`mt-3 md:mt-4 short-landscape:mt-1 text-foreground/60 leading-relaxed max-w-[640px] short-landscape:text-[11px] ${
                    isKa ? 'text-[12px] md:text-[14px]' : 'text-[14px] md:text-[16px]'
                  }`}
                >
                  {project.description}
                </p>
              )}
            </>
          )}
        </div>
```

Replace with (every `md:` → `lg:`; base values now apply through tablet):

```tsx
        <div className="mt-6 lg:mt-5 short-landscape:mt-2 text-center shrink-0 min-h-[80px] lg:min-h-[64px] short-landscape:min-h-0 flex flex-col items-center justify-start">
          {activeIndex === 0 && (
            <>
              <h2
                className={`font-light tracking-[0.04em] text-foreground/90 short-landscape:text-[16px] ${
                  isKa ? 'text-[18px] lg:text-[26px]' : 'text-[22px] lg:text-[32px]'
                }`}
              >
                {project.title}
              </h2>
              {project.description && (
                <p
                  className={`mt-3 lg:mt-4 short-landscape:mt-1 text-foreground/60 leading-relaxed max-w-[640px] short-landscape:text-[11px] ${
                    isKa ? 'text-[12px] lg:text-[14px]' : 'text-[14px] lg:text-[16px]'
                  }`}
                >
                  {project.description}
                </p>
              )}
            </>
          )}
        </div>
```

- [ ] **Step 2: Convert the info-button `md:` overrides to `lg:`**

Find (around lines 386–399):

```tsx
        <div className="shrink-0 flex items-center justify-center h-[60px] md:h-[56px] short-landscape:h-[40px] md:mt-4">
          {hasInfo && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="group inline-flex flex-col items-center text-foreground/70 hover:text-foreground transition"
            >
              <span className="text-[10px] md:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase">
                {infoLabel}
              </span>
              <span className="mt-2 h-px w-10 bg-foreground/60 transition-all duration-300 group-hover:w-16" />
            </button>
          )}
        </div>
```

Replace with (`md:` → `lg:`):

```tsx
        <div className="shrink-0 flex items-center justify-center h-[60px] lg:h-[56px] short-landscape:h-[40px] lg:mt-4">
          {hasInfo && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="group inline-flex flex-col items-center text-foreground/70 hover:text-foreground transition"
            >
              <span className="text-[10px] lg:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase">
                {infoLabel}
              </span>
              <span className="mt-2 h-px w-10 bg-foreground/60 transition-all duration-300 group-hover:w-16" />
            </button>
          )}
        </div>
```

- [ ] **Step 3: Remove the `imgMaxH` state declaration**

Find (around lines 64–66):

```tsx
  const [stageHeight, setStageHeight] = useState<string>();
  // Pixel cap for the mobile image so the stack hugs the image (no letterbox
  // bands) and stays vertically centred with equal gaps for any aspect ratio.
  const [imgMaxH, setImgMaxH] = useState<number>();
```

Replace with:

```tsx
  const [stageHeight, setStageHeight] = useState<string>();
```

- [ ] **Step 4: Remove the `setImgMaxH` call inside the resize effect**

Find (around lines 78–79):

```tsx
      setStageHeight(`${vh - h}px`);
      setImgMaxH(Math.round((vh - h) * 0.52));
```

Replace with:

```tsx
      setStageHeight(`${vh - h}px`);
```

- [ ] **Step 5: Confirm no `imgMaxH` references remain**

Run: `grep -n "imgMaxH" src/components/projects/ProjectDetailClient.tsx`
Expected: no output.

- [ ] **Step 6: Lint + typecheck via build-free lint, then build**

Run: `npm run lint`
Expected: no new errors (no "unused variable `imgMaxH`").

Run: `npm run build`
Expected: build succeeds (compiles `ProjectDetailClient.tsx` with no type errors).

- [ ] **Step 7: Commit**

```bash
git add src/components/projects/ProjectDetailClient.tsx
git commit -m "fix: unify detail text/info sizing to lg breakpoint, drop imgMaxH

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Visual verification across devices

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server on `http://localhost:3000`.

- [ ] **Step 2: Open a project detail page and check phone viewports**

In the browser device toolbar, open `/ka/projects/<id>` (and `/en/...`) for a **single-image** project. Check 375×667, 390×844, 393×852, 402×874, 430×932.
Expected on every size: CLOSE pinned top-right (does not move), photo vertically centered in the middle region, title+description below the photo (slide 0), INFO button near the bottom in the same spot. Structure identical across sizes.

- [ ] **Step 3: Check the tablet viewport matches the phone style**

Set 820×1180 (and 768×1024). 
Expected: same structure as the phone — single centered photo (not the old desktop fill behavior diverging), INFO button in the same relative place. Tablet now visually matches mobile.

- [ ] **Step 4: Check a two-image project `<lg`**

Open a **two-image** project. At 390×844 and 820×1180:
Expected: two photos stacked vertically (top + bottom), each `object-contain`, centered as a group. Tablet stacks the same as mobile.

- [ ] **Step 5: Check INFO button stability across slides**

For a multi-page project, navigate slides (swipe/scroll/dots). 
Expected: the INFO button stays in exactly the same vertical position on slide 0 (with title) and slides 1+ (without title); the photo stays centered.

- [ ] **Step 6: Check scroll-entry consistency**

On the projects grid, scroll to the bottom, then open a project. Compare with entering a project from the top of the grid.
Expected: identical detail layout regardless of prior scroll position.

- [ ] **Step 7: Confirm no desktop / landscape regression**

At ≥1024px: desktop layout unchanged — single image fills, two images side-by-side, info drawer slides from the left.
Rotate a phone to landscape (`short-landscape`): layout unchanged from before this work (side-by-side images, compact text).

- [ ] **Step 8: Confirm other pages unaffected**

Open the home page (`SelectedWork`) and the projects grid (`ProjectsClient`).
Expected: images render exactly as before (these use `ResponsiveProjectImage` with the default `md` switch).

- [ ] **Step 9: Stop the dev server.**

---

## Self-Review (completed by plan author)

- **Spec coverage:** mobile≠tablet root cause → Tasks 3, 4 (+ Task 1 `switchAt`). Photo-not-centered → Task 2 (anchored column, `flex-1` stage). Scroll-entry → preserved `visualViewport` `stageHeight` (untouched) + verified in Task 6 Step 6. INFO never moves → reserved `min-h` text zone (Task 5) + fixed-height button + anchored column. Unify `<lg` / switch at `lg` → all `md:` content overrides moved to `lg:` (Tasks 2–5). Desktop & landscape preserved → side-by-side moved to `lg`/`short-landscape` only; `md:` chrome offsets (main height, CLOSE, paddings) intentionally left per the header note. Other pages preserved → `switchAt` defaults to `md` (Task 1 Step 2).
- **Placeholder scan:** none — every step shows exact before/after code or an exact command.
- **Type consistency:** `switchAt?: 'md' | 'lg'` defined in Task 1 and used as `switchAt="lg"` in Tasks 3–4. `imgMaxH`/`setImgMaxH` fully removed (Task 5 Steps 3–5).
