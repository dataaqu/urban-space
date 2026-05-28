# Project detail — landscape/rotate layout fix

**Date:** 2026-05-28
**Component:** `src/components/projects/ProjectDetailClient.tsx`
**Scope:** rotated-phone (landscape) rendering only

## Problem

On a rotated phone (landscape, short height) the project detail view is broken:

1. **CLOSE overlaps the pagination dots.** Both live on the right side. `CLOSE` inherits `md:top-[130px]`, which on a ~360px-tall landscape screen lands at mid-height — directly on top of the dots at `top-[42%]`.
2. **CLOSE / dots overlap the images.** The side-by-side images span nearly the full width, so the fixed right-side chrome sits on top of the right image.
3. **Page-1 text is too big.** Title and subtitle inherit the `md:` (tablet) sizes (`text-[26px]`/`text-[32px]` title, `text-[14px]`/`text-[16px]` subtitle) because no `short-landscape:` override exists. The oversized text squeezes the cover image so it no longer fits.

## Breakpoint contract (must hold)

Per the project's responsive contract:

- **Portrait mobile (<768, no prefix):** must NOT change.
- **Desktop (≥1024, `lg:`):** must NOT change.
- All fixes live in the **`short-landscape`** variant only.

`short-landscape` is defined in `tailwind.config.ts` as `(orientation: landscape) and (max-height: 600px)`. On a rotated phone both `md:` and `short-landscape:` media queries match; because `short-landscape` is declared *after* `md` in the `screens` object, its generated CSS comes later and wins. So adding `short-landscape:` utilities cleanly overrides the inherited `md:` values without touching portrait or desktop.

## Target layout (approved: "Right rail")

```
LANDSCAPE / ROTATE
┌────────────────────────────┐
│ URBAN SPACE   ქარ/EN   ☰    │ header (sticky, unchanged)
├────────────────────────────┤
│                   CLOSE     │ ← CLOSE pinned top-right
│   ┌──────┐  ┌──────┐      · │
│   │ img  │  │ img  │      · │ ← dots: right rail, vertical center
│   └──────┘  └──────┘      · │
│        INFORMATION          │ ← info button bottom-center
└────────────────────────────┘
```

- **CLOSE** — top-right corner, just under the header.
- **Pagination dots** — own column on the far-right edge, vertically centered, clearly below CLOSE.
- **Images** — centered, padded on the right so they never reach the rail.
- **Info button** — bottom-center.
- Nothing overlaps; text scaled down so the cover image regains height.

## Changes (all in `ProjectDetailClient.tsx`)

All additions are `short-landscape:` utilities appended to existing class lists. No config change (the variant already exists).

1. **CLOSE position** — add `short-landscape:top-[64px]` to the close `<Link>` so it sits just below the header at top-right (overrides inherited `md:top-[130px]`).

2. **Dots position** — on the pagination dots wrapper, add `short-landscape:top-1/2 short-landscape:mt-0` so the dots are at true vertical center (overrides `top-[42%] -mt-10`), separated from CLOSE.

3. **Image right gutter** — add `short-landscape:pr-16` to the center-stack container (`flex h-full w-full flex-col …`) so the side-by-side images stop short of the right edge where CLOSE + dots live.

4. **Page-1 title size** — add `short-landscape:text-[16px]` to the `<h2>` title (overrides `md:text-[26px]`/`text-[32px]`).

5. **Page-1 subtitle size** — add `short-landscape:text-[11px]` to the description `<p>` (overrides `md:text-[14px]`/`text-[16px]`); add `short-landscape:mt-1` to tighten the title→subtitle gap.

6. **Chrome label size** — add `short-landscape:text-[9px]` to the CLOSE label and the INFORMATION label so they read as secondary chrome.

## Acceptance criteria

Verified on a rotated phone viewport (landscape, height ≤ 600px), e.g. 740×360:

- [ ] CLOSE and pagination dots do not overlap.
- [ ] CLOSE and pagination dots do not sit on top of either image.
- [ ] On page 1, the cover image, title, subtitle, and INFORMATION button all fit without the image being squished to a sliver.
- [ ] On double-image pages, both images are centered and clear of the right rail.
- [ ] Portrait mobile (<768) is pixel-identical to before.
- [ ] Desktop (≥1024) is pixel-identical to before.

## Out of scope

- Portrait mobile and desktop layouts.
- Any change to navigation behavior, the info drawer, or the slide engine.
- Tailwind config changes.
