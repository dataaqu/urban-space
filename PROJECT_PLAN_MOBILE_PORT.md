# PROJECT PLAN — Mobile / Tablet Style Port from `urbanspace-mobile`

**Project:** urban-space (Next.js App Router + next-intl + Prisma)
**Source of mobile design:** `./urbanspace-mobile/` (Vite + React Router + shadcn/ui)
**Status:** Planning
**Created:** 2026-05-22
**Last Updated:** 2026-05-22
**Plugin Version:** 1.1.1

---

## 1. Overview

ვიყენებთ `urbanspace-mobile/` ფოლდერში არსებულ მობილურ/ტაბლეტ-პირველი დიზაინს როგორც **ერთადერთ ვიზუალურ წყაროს** `urban-space`-ის საჯარო გვერდებისთვის, **მაგრამ მხოლოდ ≤1023px ეკრანებზე**. ≥1024px (Tailwind `lg`) დარჩება ისე როგორც დღეს არის — არ შეიცვალოს არც ერთი desktop კლასი, layout, ან ფერი.

### კრიტიკული წესი (ერთიანი ხელშეკრულება ყველა ფაზისთვის)

| Viewport | რა აჩვენებს | Tailwind prefix |
|----------|-------------|------------------|
| 0–767 px (xs/sm) | `urbanspace-mobile`-ის mobile სტილი | no prefix |
| 768–1023 px (md, ჯერ-კიდევ `<lg`) | `urbanspace-mobile`-ის `md:` ვერსიის სტილი | `md:` |
| ≥1024 px (lg+) | **არსებული** `urban-space` desktop სტილი — ხელშეუხებელი | `lg:` |

ანუ ყოველი className უნდა იყოს ფორმის:
```
"<mobile-from-source> md:<tablet-from-source> lg:<UNCHANGED-existing-desktop>"
```
თუ `lg:` reset არ არის და მობილური სტილი მემკვიდრეობით გადადის desktop-ზე, desktop ფუჭდება — ეს არ უნდა მოხდეს ცალკეულ ფაილში. ყოველი ცვლილების PR/commit-ში სავალდებულოა screenshot ≥1024px ეკრანზე, რომელიც ადასტურებს რომ desktop არაფერი შეცვლილა.

### Scope (4 საჯარო გვერდი)

| # | Target page (urban-space) | Source pattern (urbanspace-mobile) |
|---|---------------------------|------------------------------------|
| 1 | `src/app/[locale]/page.tsx` (Home) | `pages/Index.tsx` → `components/Hero.tsx`, `components/Projects.tsx`, `components/Footer.tsx`, `components/SplashScreen.tsx` |
| 2 | `src/app/[locale]/projects/page.tsx` | `pages/ProjectsPage.tsx` → `components/ProjectsHeader.tsx`, list grid |
| 3 | `src/app/[locale]/projects/[id]/page.tsx` | `pages/QobuletiProjectPage.tsx` |
| 4 | `src/app/[locale]/contact/page.tsx` | `pages/ContactPage.tsx` → `components/Contact.tsx`, `components/MinimalMap.tsx` |
| Shared | `src/components/layout/SiteHeader.tsx` | `components/Navigation.tsx` |

### Out of Scope

- **Desktop layout/styling (≥1024px)** — ხელშეუხებელია.
- Admin panel (`/admin/**`) — სცადეთ რომ არც შემთხვევით შეგვეხოს.
- Studio გვერდი (`/studio`) — არც ერთი ფაზაში არ შემოდის.
- Routing, i18n keys, Prisma queries — არ ცვლის ვერც ერთი ფაზა.
- urbanspace-mobile-ში არსებული unused კომპონენტები: `About.tsx`, `Services.tsx` (orphan, არ იმპორტდება არსად) — არ პორტდება.
- urbanspace-mobile-ის სტატიკური `src/assets/*.jpg` ფაილები — არ კოპირდება. ვიყენებთ არსებულ Prisma-ს მონაცემებს და `public/`-ში არსებულ სურათებს.

### Decisions Captured (clarification round)

| გადაწყვეტილება | არჩევანი |
|----------------|----------|
| Mobile/desktop breakpoint cutoff | **`lg` = 1024px** (mobile+tablet ერთად <1024px) |
| Იმპლემენტაციის სტრატეგია | **Responsive utilities ერთ კომპონენტში** (Tailwind `lg:` reset desktop-ისთვის) |
| რომელი გვერდები | Home + Projects list + Project detail + Contact (4-ვე საჯარო) |
| Plan ფაილი | ახალი ფაილი `PROJECT_PLAN_MOBILE_PORT.md` |
| Header სტრატეგია | ერთიანი `SiteHeader.tsx` + responsive (drawer <lg, current nav lg+) |
| Assets | არსებული urban-space სურათები + Prisma დინამიური მონაცემები |
| ვერიფიკაცია | მანუალური: `npm run dev` + Chrome DevTools 375/768/1023/1024/1280 px |

---

## 2. Visual Language Reference (Source-of-Truth Tokens)

ეს არის ის ფერები, ფონტები, spacing რომელიც `urbanspace-mobile`-ში წყაროდ ვრცელდება. ყოველი მობილური className ჩამოყალიბდეს ამ tokens-ის ფარგლებში.

### Brand Colors (HSL და literal HEX)

| Token | HSL | HEX | მაგ. გამოყენება |
|-------|-----|-----|-----------------|
| Background | `0 0% 98%` | `#fafafa` | gallery sections |
| Foreground (charcoal) | `0 0% 10%` | `#1a1a1a` / `#222222` | title text |
| Muted text (slate) | `0 0% 25%` | — | secondary text |
| Secondary gray text | — | `#777777` | eyebrow, metadata |
| Section bg gray | — | `#F2F2F2` | Projects/SelectedWork background |
| Accent gold | `43 74% 53%` | `#d4a027`-ის ნათელი ვერსია | hover, accents |
| Backdrop overlay | `rgba(20,20,20,0.72)` | — | drawer menu |

### Typography

- **Latin (EN):** Inter, system-ui, sans-serif
- **Georgian (KA):** Noto Sans Georgian, Inter, system-ui, sans-serif
- **Display:** Cormorant Garamond, Georgia, serif (Hero subtitle თუ გვინდა; ჯერ არ ვიყენებთ).
- **Letter tracking patterns ხშირად:** `tracking-[0.06em]` (titles), `tracking-[0.2em]` (eyebrows/CTA), `tracking-[0.16em]` (splash), `tracking-[0.12em]` (splash subtitle).
- **Font weight:** ძირითადად `font-light` (300) — სამშენებლო/luxury სტილი.

### Spacing & Layout

- Section padding mobile: `px-8 py-24` (Projects), `px-4 py-16` (Contact ≈), `container mx-auto px-8` (Nav).
- Section padding tablet (`md:`): `md:px-10 md:py-32`.
- Gaps: `gap-8` mobile → `md:gap-12` tablet.
- Max width: `mx-auto max-w-[1920px]` (full-bleed luxury).

### Behavior patterns

- **Hero scroll-trigger:** `requestAnimationFrame` + refs (no React re-render). `isMobileLayout = vw<768 || (vw<1024 && !landscapePhone) || landscapePhone`. Logo translates from center to top-left as scroll progresses 15%→85% of viewport.
- **Background carousel:** `setInterval` every 8000ms cycling through Prisma `HeroSlide[]`.
- **Drawer/menu:** Swipe gesture `EDGE=30px` from right, `THRESHOLD=60px`, only `(max-width: 767px)`. Backdrop `bg-background/80 backdrop-blur-sm`.
- **Splash:** sessionStorage flag `urban-space:splash-shown`. Bg fades at 1400ms, full dismiss at 2600ms. Click-anywhere dismisses.

### Global tokens — ჩასამატებელია `src/app/globals.css`-ში (თუ აკლია)

შემოწმდეს ჯერ რა არსებობს. დასამატებელია:
- `--charcoal: 0 0% 10%`
- `--gold: 43 74% 53%`
- `--slate: 0 0% 25%`
- `--gradient-gold: linear-gradient(135deg, hsl(43 74% 53%), hsl(38 80% 45%))`
- `--gradient-dark: linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 20%))`
- `--shadow-elegant: 0 20px 60px -15px hsl(0 0% 0% / 0.3)`
- `--shadow-soft: 0 4px 20px hsl(0 0% 0% / 0.08)`
- `html.font-georgian` / `html.font-inter` selectors (locale-driven font-family swap)
- Body: `overscroll-behavior-x: none` (mobile swipe-back prevention)

Tailwind config-ში (`tailwind.config.ts`): `charcoal`, `gold`, `slate` HSL-ად, `backgroundImage.gradient-gold` / `gradient-dark`, `boxShadow.elegant` / `soft` — ნაწილი უკვე არსებობს, საჭიროა შემოწმება.

---

## 3. Architecture & Decisions

### A. რატომ "single component + responsive utilities" და არა "მობილური ცალკე კომპონენტი"

- ერთი source of truth ერთ-ერთი — markup დუბლირება არ ხდება.
- Next.js SSR-ში ორმაგი render-ის რისკი არ არსებობს (hydration mismatch არ წარმოიქმნება useMediaQuery hook-ის გამოყენებისას).
- Tailwind-ის `lg:` prefix ბუნებრივად ემთხვევა ჩვენი breakpoint-ის სტრატეგიას.
- Trade-off: className-ები ხდება უფრო გრძელი, მაგრამ ცხადია. დიდი variant-ის შემთხვევაში `cva`-ს (class-variance-authority) გამოყენება სურვილისამებრ.

### B. რატომ `lg` (1024px) და არა `md`/`xl`

- `lg` ემთხვევა iPad landscape-ის (1024×768) ჩვეულებრივ ბრაუზერ ხედვას.
- desktop UX (mouse hover) ჩვეულებრივ ≥1024px-ზე იწყება.
- `urbanspace-mobile`-ში `md:` უკვე გამოყენებულია "tablet"-ის სტილებად — შენახულია იგივე semantics: მისი `md:` → ჩვენი `md:` (768-1023), მისი mobile (no prefix) → ჩვენი mobile (no prefix), desktop ცალკე `lg:` reset-ით.

### C. Header/Footer როგორ მუშაობს

- `SiteHeader.tsx`: ერთი კომპონენტი, ორი variant.
  - `<lg`: hamburger + slide-in drawer aside + swipe gesture (port from `Navigation.tsx`).
  - `lg+`: არსებული horizontal nav უცვლელია.
- `HomeFooter.tsx`: ერთი variant, რომელიც `<lg`-ზე stack-ად ჩამოყალიბდება (`flex-col gap-6`) და `lg:` reset-ით ბრუნდება არსებულ desktop layout-ზე.

### D. Hero scroll-animation — სარისკო ადგილი

`urbanspace-mobile/Hero.tsx`-ში 471 ხაზის scroll engine იყენებს `requestAnimationFrame`-ს და DOM ref-ებს. Next.js App Router-ში ეს მუშაობს `'use client'`-ით. გასათვალისწინებელია:
- iOS Safari address bar-ის dynamic `vh`-ის პრობლემა → გადაცემული `100dvh`-ით თუ შესაძლებელია.
- `useEffect`-ის cleanup სავალდებულოა (`removeEventListener`).
- `useSwipeMenu` hook port უნდა მოხდეს როგორც ცალკე `src/hooks/use-swipe-menu.ts` (თუ ჯერ არ არსებობს).

---

## 4. Phases & Tasks

ფაზები სამუშაო-ლოგიკურია. ნაკლები dependency-ის ფაზები პარალელურადაც დაიწყება (Hero და Contact მაგ.). ყოველი task-ი ცალკე commit/PR-ში.

---

### Phase 1 — Foundation: Tokens, Globals & Baseline Audit

**მიზანი:** გადავამოწმოთ რომ tailwind/globals.css მიყვება მობილური წყაროს და ჩავწეროთ desktop-ის ბაზური ფოტო-სტანდარტი (რომ შემდეგი ცვლილებები იყოს შესადარისი).

#### T1.1: Audit existing CSS variables and Tailwind theme alignment
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - წავიკითხოთ `src/app/globals.css` და დავაფიქსიროთ რომელი variable უკვე არსებობს (`--charcoal`, `--gold`, `--slate`, `--gradient-gold`, `--gradient-dark`, `--shadow-elegant`, `--shadow-soft`).
  - წავიკითხოთ `tailwind.config.ts` და დავუპირისპიროთ `urbanspace-mobile/tailwind.config.ts`-ს. დავაფიქსიროთ missing tokens.
  - გამოვა ცხრილი `STYLE_AUDIT_T1.1.md`-ში: column1=token, column2=mobile-source, column3=urban-space-current, column4=action (add/keep/skip).

#### T1.2: Add missing CSS variables to `globals.css`
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T1.1
- **Description**:
  - დავამატოთ მხოლოდ ის variable, რომელიც T1.1-ში "add"-ად მონიშნული. **არ შევცვალოთ** არსებული `--background`, `--foreground`, `--primary` და ა.შ. (desktop-ის წყაროა).
  - დავამატოთ `html.font-georgian` / `html.font-inter` selector-ები თუ აკლია.
  - დავამატოთ `body { overscroll-behavior-x: none; }`.
  - ვერიფიკაცია: `npm run dev` → ნახე home page desktop-ზე, არ შეიცვალოს.

#### T1.3: Extend `tailwind.config.ts` with missing theme tokens
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T1.1
- **Description**:
  - დავამატოთ `colors.charcoal`, `colors.gold`, `colors.slate` HSL-ად (`hsl(var(--charcoal))` etc).
  - დავამატოთ `backgroundImage.gradient-gold`, `backgroundImage.gradient-dark` თუ აკლია.
  - დავამატოთ `boxShadow.elegant`, `boxShadow.soft` თუ აკლია.
  - არ წავშალოთ არსებული `primary`/`secondary`/`accent` luxury palette-ი (desktop-ისთვის გვჭირდება).

#### T1.4: Capture desktop baseline screenshots (regression reference)
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - `npm run dev` → DevTools → 1280×800 და 1920×1080.
  - გადავიღოთ screenshots: `/ka`, `/en`, `/ka/projects`, `/ka/projects/<slug>`, `/ka/contact`.
  - შევინახოთ `.workspace/baseline-desktop/`-ში (gitignored). გამოყენდება ყოველი task-ის ბოლოს რეგრესიის შესამოწმებლად.

#### T1.5: Port `use-swipe-menu` hook
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - გადავიტანოთ `urbanspace-mobile/src/hooks/use-swipe-menu.ts` → `src/hooks/use-swipe-menu.ts`.
  - დავნახოთ რომ მუშაობს მხოლოდ `(max-width: 1023px)` (და არა `(max-width: 767px)` როგორც წყაროში) — ეს ჩვენი `lg` cutoff-ის შესაბამისად.
  - დავამატოთ `'use client'` directive.

---

### Phase 2 — Shared Chrome: Header, Splash, Footer

**მიზანი:** ყველა გვერდისთვის საერთო კომპონენტები, რომელიც ერთხელ რომ მოვაგვაროთ, ყოველი გვერდი ისარგებლებს.

#### T2.1: Port mobile drawer navigation into `SiteHeader.tsx` (<lg only)
- [ ] **Status**: TODO
- **Complexity**: High
- **Dependencies**: T1.5
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/Navigation.tsx` (202 ხაზი).
  - target: `src/components/layout/SiteHeader.tsx` (უკვე modified status-შია).
  - იმპლემენტაცია:
    - `<lg`-ზე: hamburger top-right (`lg:hidden`), slide-in `aside` ფიქსირებული `top-0 right-0`, `w-full sm:w-[420px]`, `bg-[rgba(20,20,20,0.72)] backdrop-blur-sm`, `z-50`.
    - Projects/Studio/Contact collapsible sections Plus/Minus icon-ით (`lucide-react`).
    - Locale switcher (ქარ / EN) ზედა-მარჯვნივ aside-ში; **გამოვიყენოთ `useLocale()` და `router.replace()`** არსებული `SiteHeader`-ის pattern-ით (არ React Router).
    - Projects-ის ქვედა link-ები: Architecture (`/projects?category=ARCHITECTURE`) / Urban (`/projects?category=URBAN`).
    - `lg:` reset: hamburger იმალება, არსებული horizontal nav ჩნდება (ისე როგორც დღეს არის — **არ შეიცვალოს**).
  - swipe gesture: `useSwipeMenu` hook (T1.5).
  - სავალდებულო: scroll behavior — `scrolled` state, `bg-background/80 backdrop-blur-sm` როცა scrolled.
  - **Acceptance:** მობილურზე drawer სრიალდება მარჯვნიდან, links აქცევენ ნავიგაციას, swipe-from-right ხსნის menu-ს. Desktop ≥1024px-ზე ვერც ერთი ვიზუალური ცვლილება არ ჩანს (T1.4 screenshot-თან 1:1).

#### T2.2: Reconcile `SplashScreen` typography with mobile source
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/SplashScreen.tsx`.
  - target: `src/components/home/SplashScreen.tsx` (უკვე არსებობს).
  - შევადაროთ და გავიგოთ რომელი typography უნდა იყოს `<lg`-ზე:
    - Title `text-[34px] md:text-[56px]` (წყაროდან) → `<lg`-ზე უნდა იყოს ეს, `lg:` reset-ით უნდა დარჩეს არსებული desktop ვერსია.
    - Underline `h-px w-24 md:w-32` → `<lg`-ზე ეს, `lg:` reset-ით უცვლელია.
    - Subtitle `text-sm md:text-[18px] tracking-[0.12em] opacity-85`.
  - Timing logic უცვლელია (sessionStorage flag თავად სამუშაოა).
  - ვერიფიკაცია: 375px-ზე splash ემთხვევა urbanspace-mobile-ის dev server-ის რენდერს.

#### T2.3: Port `HomeFooter.tsx` mobile layout (<lg)
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: None
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/Footer.tsx` (80 ხაზი).
  - target: `src/components/home/HomeFooter.tsx`.
  - იმპლემენტაცია:
    - `<lg`: `flex flex-col gap-6 items-center text-center`, MapPin + address + Phone + social icons stack-ში.
    - Typography: title `text-lg`, subtitle `text-[9px]`, social link `text-sm font-light tracking-[0.2em] uppercase border-b border-secondary-foreground/30 pb-1`.
    - `lg:` reset: არსებული horizontal layout უცვლელია.
    - **არ შევცვალოთ** copyright year (`© 2026`-ად დატოვება) ან link-ების შინაარსი.
  - **Acceptance:** mobile/tablet-ზე vertical stack, desktop-ზე უცვლელი horizontal.

---

### Phase 3 — Home Page (Hero + SelectedWork)

**მიზანი:** გვერდის ყველაზე რთული და visually-critical კომპონენტი.

#### T3.1: Port Hero mobile scroll-animation engine into `home/Hero.tsx`
- [ ] **Status**: TODO
- **Complexity**: High
- **Dependencies**: T1.2, T1.3
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/Hero.tsx` (471 ხაზი).
  - target: `src/components/home/Hero.tsx` (უკვე modified status-ში).
  - ჩასატარებელია:
    - Refs: `logoRef`, `ctaRef`, `arrowRef`, `arrowWrapRef`, `overlayDarkRef`, `overlayWhiteRef`, `topbarRef`, `langRef`.
    - Scroll engine: `requestAnimationFrame`, `isMobileLayout = vw<768 || (vw<1024 && !landscapePhone) || landscapePhone`.
    - Logo translate: mobile/landscape centered → top-left, scale 1→0.495; tablet anchored top-left scale 1→0.605.
    - CTA position: mobile `vh*0.67`, tablet `vh*0.72`, landscape `vh*0.78`.
    - Arrow position: mobile `vh-56px`, else `vh-70px`.
    - Background carousel: `setInterval` 8000ms, **Prisma `HeroSlide[]` data**-დან (არსებული useHeroSlides hook ან props).
  - გადასახარისხებელია არსებული `Hero.tsx`-ის desktop logic-თან რომ:
    - `<lg`: ახალი mobile engine ჩაირთვება.
    - `lg+`: არსებული desktop logo/CTA placement უცვლელია (თუ scroll-trigger უკვე უმუშავია, შენახული.)
  - i18n: `useTranslations('home.hero')` + dynamic `useLocale()` (არ React Router).
  - **Acceptance:** 375/768/1023 px-ზე scroll → logo dock-ი, CTA fade, arrow bounce ემთხვევა urbanspace-mobile dev-ის რენდერს; 1024+-ზე ვერც-ერთი regression.

#### T3.2: Port Hero overlays, gradients, language switcher styling
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T3.1
- **Description**:
  - Side gradient overlays: `radial-gradient(at 60% 55%)` + `radial-gradient(at 35% 40%)` for text legibility on mobile/tablet.
  - Dark/white overlay refs animated by scroll (`overlayDarkRef`, `overlayWhiteRef`).
  - Mobile language switcher: `textShadow: 0 1px 8px rgba(0,0,0,0.45)` for readability over hero image.
  - All wrapped: `<lg`-ზე ჩანს, `lg:` reset-ით ბრუნდება არსებული desktop ვერსიაზე.
  - Tagline (KA): `"არქიტექტურა და ურბანული დაგეგმარება"`; (EN): `"Architecture & urban planning"` — i18n key-ის `home.hero.tagline`-ის გავლით.

#### T3.3: Port `SelectedWork` mobile layout into `home/SelectedWork.tsx`
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T1.2
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/Projects.tsx` (150 ხაზი).
  - target: `src/components/home/SelectedWork.tsx`.
  - იმპლემენტაცია (`<lg`-მდე):
    - Section: `bg-[#F2F2F2] px-8 py-24 md:px-10 md:py-32`.
    - Container: `mx-auto max-w-[1920px]`.
    - Heading block: eyebrow `text-[12px] md:text-[16px] uppercase tracking-[0.2em] text-[#777777] font-light`; title `mt-3 font-light tracking-[0.06em] text-[#222222] text-[18px] md:text-[26px]` (EN) ან `text-[16px] md:text-[22px]` (KA).
    - Grids: first 3 projects `grid gap-8 md:grid-cols-3 md:gap-8`, next 2 `grid gap-8 md:grid-cols-2 md:gap-12 md:px-4`.
    - Card: `<a className="group block">` → `<div className="overflow-hidden bg-black/5">` → `<img className="block w-full h-auto object-contain transition duration-700 group-hover:scale-[1.02]">` → `<div className="mt-5">` (title + meta).
    - Title `text-[20px] md:text-[26px]` EN ან `text-[14px] md:text-[18px]` KA.
    - Meta `mt-1 text-[#777777]` (KA: `text-[11px] md:text-[13px]`).
    - CTA: `mt-20 md:mt-28 flex justify-center`, link `tracking-[0.2em] text-[#222222] hover:opacity-70`, underline `mt-3 h-px w-1/2 bg-[#222222]/60`.
  - `lg:` reset: არსებული `SelectedWork`-ის desktop layout რჩება უცვლელი (`lg:bg-...`, `lg:grid-cols-...`, etc — შემოწმდეს რომ ყოველი override-ი იყოს `lg:` prefix-ით).
  - Data: უცვლელია — Prisma queries-დან `featured: true` projects (max 5), translation fallbacks `home.featured.*`.
  - **Acceptance:** მობილური ემთხვევა urbanspace-mobile-ის `/`-ის Projects სექციას visually; desktop უცვლელია.

---

### Phase 4 — Projects List Page

**მიზანი:** `/projects` გვერდი იღებს mobile სტრუქტურას ProjectsHeader + grid-ის.

#### T4.1: Port `ProjectsHeader` style into `ProjectsLayout.tsx`
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T2.1
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/ProjectsHeader.tsx` (168 ხაზი).
  - target: `src/components/projects/ProjectsLayout.tsx`.
  - იმპლემენტაცია (<lg):
    - Top spacing: `pt-20 md:pt-28` (header-ის ქვემოთ).
    - Title block: centered, `text-[20px] md:text-[26px] font-light tracking-[0.06em] text-[#222222]`.
    - Optional eyebrow: `text-[12px] md:text-[16px] uppercase tracking-[0.2em] text-[#777777]`.
    - Section background: `bg-[#F2F2F2]`.
  - `lg:` reset: არსებული `ProjectsLayout`-ის desktop chrome (sidebar, etc.) ხელშეუხებელია.
  - Translation keys: `projects.header.title`, `projects.header.eyebrow`.

#### T4.2: Port projects grid into `ProjectsClient.tsx`
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - წყარო: `urbanspace-mobile/src/pages/ProjectsPage.tsx` (246 ხაზი) grid section.
  - target: `src/components/projects/ProjectsClient.tsx`.
  - იმპლემენტაცია (<lg):
    - Grid: single column mobile (`grid grid-cols-1 gap-12`), `md:grid-cols-2 md:gap-8` ტაბლეტისთვის.
    - Card structure იდენტური `SelectedWork`-ისა (T3.3).
    - Anchor sections: Architecture / Urban დაჯგუფებები; თუ `?category` query param აქვს — მხოლოდ ერთი ჯგუფი.
  - `lg:` reset: desktop-ის 3-col ან რაც არის — უცვლელია.
  - **Image variants:** `ResponsiveProjectImage` უკვე არსებობს — დარწმუნდი რომ `<lg`-ზე `mobileImage` ვერსიას იღებს.

#### T4.3: Port `CategoryFilter.tsx` mobile chip-row style
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - წყარო pattern: filter buttons (All / Architecture / Urban) ProjectsHeader-დან.
  - target: `src/components/projects/CategoryFilter.tsx`.
  - იმპლემენტაცია (<lg):
    - Layout: `flex justify-center gap-6 mt-8 mb-12`.
    - Button: `uppercase text-[12px] tracking-[0.16em] font-light`.
    - Active: `text-foreground border-b border-foreground/60 pb-1`.
    - Inactive: `text-foreground/50 hover:text-foreground/75 transition-colors`.
  - State: URL search param `?category=ARCHITECTURE|URBAN|null` (არსებული router pattern, არ შეიცვალოს).
  - `lg:` reset: desktop-ის არსებული filter (თუ აქვს), არ ჩარევა.

---

### Phase 5 — Project Detail Page

**მიზანი:** `/projects/[id]` ცალკეული პროექტის გვერდი იღებს `QobuletiProjectPage`-ის სტრუქტურას.

#### T5.1: Port project hero section into `ProjectDetailClient.tsx`
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T1.2
- **Description**:
  - წყარო: `urbanspace-mobile/src/pages/QobuletiProjectPage.tsx` (276 ხაზი) — hero section.
  - target: `src/components/projects/ProjectDetailClient.tsx`.
  - იმპლემენტაცია (<lg):
    - Hero image: `w-full aspect-[4/3] md:aspect-video object-cover`.
    - Below: title `text-[24px] md:text-[44px] tracking-[0.06em] font-light text-[#222222]`.
    - Meta row: `mt-2 text-[#777777] text-[13px] md:text-[15px]` — function · year.
    - Location chip: მცირე text below.
    - Optional sticky mobile header: scroll-shown title bar with project name.
  - i18n: `titleKa`/`titleEn`, `locationKa`/`locationEn` Prisma fields-დან, `useLocale()` switch.
  - `lg:` reset: უცვლელია.

#### T5.2: Port project gallery + description sections
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T5.1
- **Description**:
  - Gallery (<lg): single column stack, `gap-6`. `md:grid-cols-2 md:gap-8` ტაბლეტისთვის.
  - Description: `text-[16px] md:text-[18px] leading-relaxed text-[#222222]`.
  - List items custom bullet: `·` (middot) separator.
  - CTA back/next: `border-b border-[#222222]/40 pb-1 tracking-[0.2em] uppercase text-[#222222]`.
  - Image: `ResponsiveProjectImage` ყოველი gallery image-ისთვის (mobile variant <lg).
  - `lg:` reset: უცვლელია (desktop-ის grid როგორც დღეს არის).

#### T5.3: Verify `ResponsiveProjectImage` mobile variant loading
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T5.2
- **Description**:
  - წავიკითხოთ `src/components/projects/ResponsiveProjectImage.tsx`.
  - დავრწმუნდეთ რომ:
    - <lg viewport-ზე იყენებს Prisma `mobileImage` ან `mobileImage1`/`mobileImage2`/... ფილდებს.
    - Fallback თუ `mobileImage` არ არსებობს → იყენებს desktop ვერსიას.
    - `sizes` prop არის `"(max-width: 1023px) 100vw, 50vw"` (ან მსგავსი).
  - საჭიროების შემთხვევაში დააფიქსირე — სხვა task არ ცვლის ამ კომპონენტს.

---

### Phase 6 — Contact Page

**მიზანი:** `/contact` form + map = mobile სტრუქტურა.

#### T6.1: Port `Contact.tsx` form mobile layout into `ContactPageClient.tsx`
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T1.2
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/Contact.tsx` (132 ხაზი), `urbanspace-mobile/src/pages/ContactPage.tsx` (359 ხაზი).
  - target: `src/components/contact/ContactPageClient.tsx` (უკვე modified status-ში).
  - იმპლემენტაცია (<lg):
    - Section: `px-8 py-20 md:px-10 md:py-28`.
    - Title + eyebrow იდენტური SelectedWork-ის pattern-ის.
    - Form: `flex flex-col gap-6 w-full max-w-[640px] mx-auto`.
    - Inputs: `w-full border-0 border-b border-[#222222]/30 bg-transparent py-3 text-[16px] font-light focus:border-[#222222] focus:outline-none transition-colors`.
    - Submit button: `mt-6 px-8 py-3 border border-[#222222] uppercase tracking-[0.2em] text-[14px] hover:bg-[#222222] hover:text-white transition-colors`.
  - `lg:` reset: არსებული desktop layout რჩება (2-col თუ არის და ა.შ.).
  - i18n: არსებული `contact.form.*` translation keys.
  - API: `/api/contact` POST უცვლელია.

#### T6.2: Port contact info block (address, phone, social) mobile stack
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T6.1
- **Description**:
  - <lg: `flex flex-col gap-4 items-center text-center mt-12`.
  - MapPin + Phone icons (`lucide-react`) `w-4 h-4 inline mr-2`.
  - Address: KA/EN switch through `useLocale()`.
  - Social links: `flex justify-center gap-8 mt-6` (Facebook, Instagram), `text-sm font-light tracking-[0.2em] uppercase`.
  - `lg:` reset უცვლელია.

#### T6.3: Port `MinimalMap` mobile sizing
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - წყარო: `urbanspace-mobile/src/components/MinimalMap.tsx` (47 ხაზი).
  - target: `src/components/contact/MinimalMap.tsx`.
  - <lg: `w-full h-[280px] md:h-[400px]` map container, `mt-12 md:mt-16`.
  - Border: `border-t border-[#222222]/10` ზევით.
  - `lg:` reset: არსებული desktop sizing (`lg:h-[...]`) უცვლელია.
  - Leaflet იმპორტი dynamic (`'use client'` + `next/dynamic` no SSR) — შემოწმდეს რომ უკვე ასეა.

---

### Phase 7 — Verification, Polish, Regression

**მიზანი:** დარწმუნება რომ ყველაფერი მუშაობს და desktop არ გაფუჭდა.

#### T7.1: Cross-breakpoint manual sweep (375 / 768 / 1023 / 1024 / 1280 px)
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T2.3, T3.3, T4.3, T5.3, T6.3
- **Description**:
  - `npm run dev` → Chrome DevTools.
  - ყოველი breakpoint-ზე ვამოწმებთ 4 გვერდს (Home, /projects, /projects/[id], /contact) ორ ენაზე (`/ka`, `/en`).
  - Critical observations checklist:
    - 375px: yota mobile, Hero centered logo, drawer menu swipe.
    - 768px: tablet, Hero anchored top-left (tablet logic).
    - **1023px**: ბოლო `<lg` ვიუპორტი — მობილური სტილი ჯერ კიდევ ჩანს.
    - **1024px**: პირველი `lg+` ვიუპორტი — სრულად desktop layout (იდენტური T1.4 baseline-ის).
    - 1280px: desktop normal.
  - Bug log: `STYLE_AUDIT_T7.1.md`-ში.

#### T7.2: Desktop regression diff against T1.4 baseline
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T7.1
- **Description**:
  - გადავიღოთ new screenshots 1280×800 და 1920×1080-ზე ყველა გვერდისთვის.
  - vimdiff-ად (ან Compare extension-ით) shall be pixel-identical T1.4-თან.
  - ნებისმიერი diff = blocker. გავარკვიოთ რომელ task-ში გავაჟონეთ mobile სტილი desktop-ში (გამოტოვებული `lg:` reset).

#### T7.3: Locale switch test (en ↔ ka, font swap)
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T7.1
- **Description**:
  - ყოველი გვერდი ka-ში: ფონტი `Noto Sans Georgian` ჩაიტვირთება (`html.font-georgian` className active).
  - en-ში: `Inter` (font-inter).
  - Locale toggle drawer-ში მუშაობს რომ `router.replace(/en/...)` ↔ `/ka/...`.
  - Splash screen text მითითებული locale-ის შესაბამისად.

#### T7.4: iOS Safari address-bar `100vh` quirk testing
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T3.1
- **Description**:
  - Hero scroll-animation iOS Safari-ში address bar collapse-ისას არ უნდა "ჩაიფეთქოს" (jump).
  - გადატესტი: ნამდვილ iPhone-ზე (ან Xcode Simulator-ში) Hero scroll.
  - Fix თუ საჭიროა: `100dvh` (dynamic vh) გადასატანი `100vh`-ის ნაცვლად სადაც კრიტიკულია.

#### T7.5: Final polish — animations, transitions, hover states
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T7.4
- **Description**:
  - Drawer open/close timing: `duration-500 ease-out`.
  - Card hover scale: `duration-700`.
  - Splash fade: `duration-700` for both bg and dismiss.
  - Underline expand on link hover: `transition-all duration-300`.
  - დარწმუნდი რომ `prefers-reduced-motion` respect-დება (Tailwind `motion-reduce:` prefix სადაც კრიტიკულია).

#### T7.6: Code review of full diff and commit/PR strategy
- [ ] **Status**: TODO
- **Complexity**: Low
- **Dependencies**: T7.5
- **Description**:
  - `git diff main` — გადახედე ყოველი ფაილი.
  - დარწმუნდი რომ:
    - არ შეცვლილა Prisma schema, API routes, middleware, i18n config.
    - არ შეცვლილა admin/, studio/, არც ერთი `lg:` cleanup desktop-ის ცვლილების გარეშე.
  - PR title: `feat: port urbanspace-mobile design to <lg breakpoints`.
  - PR description-ში: scope ცხრილი (ფაზა 1-7), screenshots before/after per breakpoint, regression statement.

---

## 5. Risk Register

| რისკი | სიმძიმე | მიტიგაცია |
|-------|---------|-----------|
| Desktop accidentally changes (missing `lg:` reset) | **High** | T1.4 baseline + T7.2 regression check + per-task acceptance criterion |
| Hero scroll engine breaks in Next.js SSR | High | T3.1 wrapped in `'use client'`, dependent refs + cleanup; T7.4 iOS Safari sanity check |
| `mobileImage` Prisma field missing for old projects | Medium | T5.3 fallback to desktop image variant |
| Translation keys missing for mobile-only copy | Medium | Phase ფაზებში inline-fallback ან `messages/{ka,en}.json` update |
| Font-Georgian not loaded on first paint (CLS) | Medium | `font-display: swap` + preload `<link>` `layout.tsx`-ში თუ აკლია |
| Swipe gesture conflicts with browser back-swipe | Low | `overscroll-behavior-x: none` T1.2-ში |
| Existing in-progress changes (`SiteHeader`, `Hero`, `SelectedWork`, `ContactPageClient`) conflict | Medium | T1.1-ში გადახედე git diff, გადაწყდი ვინა გადარჩება/გადააქცეთ baseline-ად |

---

## 6. Out-of-Scope Reminder

ეს გეგმა **არ** ცვლის:

- `/admin/**` ნებისმიერ ფაილს.
- `/studio` გვერდს.
- `prisma/schema.prisma`, ნებისმიერ migration-ს.
- `src/app/api/**` API routes.
- `src/middleware.ts`, `src/i18n/**` translation infrastructure.
- `next.config.js`, `tsconfig.json`, `package.json` dependencies.
- desktop ≥1024px viewport-ის რენდერს ნებისმიერ public გვერდზე.

---

## 7. Specification Source

| | |
|---|---|
| **Source repo** | `./urbanspace-mobile/` (Vite + React Router 6 + shadcn/ui, TypeScript) |
| **Total source files studied** | 14 (components: 10, pages: 4) |
| **Total source LOC analyzed** | ~2380 |
| **Source design system** | charcoal/gold/slate HSL tokens + Inter/Noto Sans Georgian fonts |
| **Mobile-source breakpoint** | `md:` 768px (its own "tablet" cutoff) |
| **Our target breakpoint** | `lg:` 1024px (mobile + tablet < this; desktop ≥ this) |

### Clarifications Captured (Q&A)

1. **Breakpoint cutoff** → `lg` 1024px (mobile + tablet < this).
2. **Strategy** → Single component, Tailwind responsive utilities with `lg:` desktop reset.
3. **Page scope** → Home + Projects list + Project detail + Contact.
4. **Plan file** → New: `PROJECT_PLAN_MOBILE_PORT.md` (this file).
5. **Header strategy** → Unified `SiteHeader.tsx` + responsive drawer for `<lg`.
6. **Assets** → Existing urban-space images + Prisma dynamic data.
7. **Verification** → Manual dev server + Chrome DevTools breakpoint sweep.

---

## 8. Quick Reference — File Map

| Source (`urbanspace-mobile/src/`) | Target (`urban-space/src/`) | Used in Task |
|------------------------------------|------------------------------|--------------|
| `components/Navigation.tsx` | `components/layout/SiteHeader.tsx` | T2.1 |
| `components/SplashScreen.tsx` | `components/home/SplashScreen.tsx` | T2.2 |
| `components/Footer.tsx` | `components/home/HomeFooter.tsx` | T2.3 |
| `components/Hero.tsx` | `components/home/Hero.tsx` | T3.1, T3.2 |
| `components/Projects.tsx` | `components/home/SelectedWork.tsx` | T3.3 |
| `components/ProjectsHeader.tsx` | `components/projects/ProjectsLayout.tsx` | T4.1 |
| `pages/ProjectsPage.tsx` (grid) | `components/projects/ProjectsClient.tsx` | T4.2 |
| (filter pattern in ProjectsHeader) | `components/projects/CategoryFilter.tsx` | T4.3 |
| `pages/QobuletiProjectPage.tsx` (hero) | `components/projects/ProjectDetailClient.tsx` | T5.1 |
| `pages/QobuletiProjectPage.tsx` (gallery) | `components/projects/ProjectDetailClient.tsx` | T5.2 |
| (image variants) | `components/projects/ResponsiveProjectImage.tsx` | T5.3 |
| `components/Contact.tsx`, `pages/ContactPage.tsx` | `components/contact/ContactPageClient.tsx` | T6.1, T6.2 |
| `components/MinimalMap.tsx` | `components/contact/MinimalMap.tsx` | T6.3 |
| `hooks/use-swipe-menu.ts` | `hooks/use-swipe-menu.ts` (new) | T1.5 |

---

**End of plan.**

შემდეგი ნაბიჯი: გადახედე ფაზები 1-7, თუ ცვლილება გვინდა (მაგ. ფაზის გადანაცვლება ან dependency-ის შეცვლა), მითხარი. შემდეგ შეიძლება `T1.1`-ით დავიწყოთ (`/planUpdate T1.1 start`) ან რომელიც გვინდა.
