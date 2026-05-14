# T5.1: Style Audit — `urbanspace-site-latest` → `urban-space` (Next.js)

**Created:** 2026-05-08
**Source:** `urbanspace-site-latest/src/` (Vite + React + react-router)
**Target:** `urban-space/src/` (Next.js App Router + next-intl)
**Scope:** Mobile styles for Home pages + full Contact page (mobile + desktop)

---

## 1. Source → Target Component Mapping

| Source (Vite) | Target (Next.js) | Scope |
|---------------|------------------|-------|
| `src/components/Hero.tsx` | `src/components/home/Hero.tsx` | Mobile only |
| `src/components/Navigation.tsx` | `src/components/home/HomeNav.tsx` + `layout/Navigation.tsx` | Mobile only |
| `src/components/About.tsx` | (new home section, არ არსებობს) | Mobile only — დამატება? |
| `src/components/Services.tsx` | (არ არსებობს — Phase 1 cleanup-ში წაშლილია) | **გამოტოვება** |
| `src/components/Projects.tsx` | `src/components/home/SelectedWork.tsx` | Mobile only |
| `src/components/Footer.tsx` | `src/components/home/HomeFooter.tsx` | Mobile only |
| `src/pages/ContactPage.tsx` | `src/app/[locale]/contact/page.tsx` + `components/contact/*` | **Full (mobile + desktop)** |
| `src/components/Contact.tsx` | (form section ContactPage-ში) | Full |
| `src/components/MinimalMap.tsx` | `src/components/contact/GoogleMap.tsx` (replace) | Full — Leaflet |

---

## 2. Mobile Breakpoints (Tailwind)

Source uses ერთიანი მიდგომა:
- **Mobile:** `< 768px` (no prefix)
- **Tablet:** `md:` (`>= 768px`)
- **Desktop:** `lg:` (`>= 1024px`) — გამოყენება ContactPage-ში

JS-based breakpoints (`Hero.tsx`):
- `isLandscapePhone`: `vh < 500 && vw > vh`
- `isMobile`: `vw < 768 && !isLandscapePhone`
- `isTablet`: `vw >= 768 && vw < 1024 && !isLandscapePhone`

---

## 3. Mobile Styles by Component

### 3.1 Hero (`source/Hero.tsx` → `target/home/Hero.tsx`)

**Background carousel:**
- `<section className="relative min-h-screen w-full overflow-hidden bg-foreground text-background">`
- `<img className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]">`
- 8s auto-rotate (`setInterval` 8000)

**Logo (mobile-specific transform):**
- Mobile centered, scrolls into top-left dock:
  - `text-[34px] md:text-[47px] lg:text-[56px] font-light tracking-[0.16em]`
  - `whitespace-nowrap`, `Inter font`
  - JS-driven `translate3d` based on scroll progress
- Underline: `mt-2 md:mt-2.5 lg:mt-3 block h-[2px] md:h-px w-24 md:w-32 mx-auto md:mx-0`
- Tagline: `text-[11px] md:text-[13px] lg:text-[15px]` (ka) / `text-sm md:text-[15px] lg:text-[18px]` (en)

**Top controls (mobile):**
- Lang switcher: `top-8 left-8 md:left-auto md:right-[5.5rem] md:top-10`
  - Mobile: top-left, fades on scroll
  - Desktop: top-right, persistent
- Hamburger: `top-8 md:top-10 right-8 md:right-10`
  - 5×5 box with 3 lines (animate to X)
  - Lines: `h-[1px] w-full transition`, color swaps based on `docked`

**CTA "EXPLORE PROJECTS":**
- Mobile: `text-[16px]` (ka) / `text-[18px]` (en)
- Position: JS-driven, anchored at ~67% viewport height on mobile
- Compresses on scroll

**Down arrow:**
- Mobile: positioned at `vh - 56`px (near bottom)
- Desktop: at `vh * 0.78`
- `text-[22px] md:text-[20px] lg:text-[28px]`

**Side menu (slide-in panel):**
- `fixed top-0 right-0 z-40 h-full w-full sm:w-[420px] md:w-[480px]`
- Mobile: full width
- Background: `rgba(20, 20, 20, 0.72)` + `backdrop-blur-10px`
- Animation: `translate-x-0` ↔ `translate-x-full`, 500ms ease-out
- Backdrop: `bg-black/28 backdrop-blur-6px`
- Content: Projects (collapsible Architecture/Urban), About, Contact
- Bottom: Instagram/Facebook links
- Swipe gestures: `useSwipeMenu` hook (touch events from right edge)

### 3.2 Navigation (`source/Navigation.tsx`)

**Sticky bar (mobile):**
- `fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm`
- Hides on `isHome && !scrolled`, slides up `-translate-y-4`
- Container: `container mx-auto px-8 lg:px-16`
- Height: `h-20`

**Logo:** `text-xl font-light tracking-widest`

**Mobile hamburger:**
- `md:hidden` — only on mobile
- Uses `lucide-react` `Menu`/`X` icons size 24

**Mobile slide-in panel:**
- `md:hidden fixed top-0 right-0 z-40 h-full w-3/4 max-w-xs bg-background shadow-xl`
- Border: `border-l border-border`
- Content padding: `px-8 pt-24`
- Links: `block w-full text-left text-foreground hover:text-accent transition-colors py-2`

**Lang toggle:** small text buttons `text-sm tracking-wider`

### 3.3 About (`source/About.tsx`)

- Section: `py-24 lg:py-32 bg-background`
- Container: `container mx-auto px-6 lg:px-12`
- Content: `max-w-4xl mx-auto`
- Heading: `text-4xl md:text-5xl font-bold mt-4 mb-6`
- Eyebrow: `text-accent text-sm font-semibold tracking-wider uppercase`
- Grid: `grid md:grid-cols-2 gap-12`
- Stats: `border-l-2 border-accent pl-6`, `text-2xl font-semibold`

**Note:** ეს კომპონენტი არ არის Next.js-ში. გადაწყვეტილება: დავამატო თუ გამოვტოვო?

### 3.4 SelectedWork / Projects (`source/Projects.tsx` → `target/SelectedWork.tsx`)

- Section: `bg-[#F2F2F2] px-8 py-24 md:px-10 md:py-32`
- Container: `mx-auto max-w-[1920px]`
- Eyebrow: `text-[12px] md:text-[16px] uppercase tracking-[0.2em] text-[#777777] font-light`
- Title: locale-aware sizing
  - ka: `text-[16px] md:text-[22px]`
  - en: `text-[18px] md:text-[26px]`
- Grid stack: `flex flex-col gap-16 md:gap-24`
  - Row 1 (3 projects): `grid gap-8 md:grid-cols-3`
  - Row 2 (2 projects): `grid gap-8 md:grid-cols-2 md:gap-12 md:px-4`
- Image: `overflow-hidden bg-black/5`, `block w-full h-auto object-contain transition duration-700 group-hover:scale-[1.02]`
- Meta:
  - Title: `font-light text-[#222222]`, locale sized
  - Subtitle: `mt-1 text-[#777777]` — `function · location`
- Bottom CTA: "EXPLORE PROJECTS" centered, with `h-px w-1/2 bg-[#222222]/60` underline

**Note:** PROJECT_PLAN_STYLE_PORT.md-ში უკვე გადატანილია ნაწილი — გადასამოწმებელი მიმდინარე მდგომარეობა.

### 3.5 Footer (`source/Footer.tsx` → `target/HomeFooter.tsx`)

- `<footer id="contact" className="bg-secondary text-secondary-foreground border-t border-border">`
- Container: `mx-auto max-w-[1400px] px-6 lg:px-10 py-20 lg:py-28`
- Logo block: `text-lg md:text-xl font-light tracking-[0.16em]`
- Tagline: `text-[9px] md:text-[10px] tracking-[0.2em] opacity-60`
- Contact info: centered column, gap-6
  - Items: `flex items-center gap-3 text-sm md:text-base font-light`
  - Icons: `lucide-react` `MapPin/Phone/Mail` size 16, strokeWidth 1.25
- Social: `flex items-center gap-8`, border-bottom links
- Copyright: `text-[10px] md:text-xs tracking-[0.2em] opacity-60`

---

## 4. Contact Page (Full — Mobile + Desktop)

### 4.1 ContactPage Layout (`source/pages/ContactPage.tsx`)

**Header (sticky):**
- `sticky top-0 z-40 border-b border-foreground/10 bg-background/85 px-8 py-4 backdrop-blur-md md:px-10 md:py-5`
- Logo: `text-[15px] md:text-[31px] font-light tracking-[0.16em]`
- Mobile-only tagline display: `hidden md:block` for tagline
- Lang toggle: `hidden md:inline-block` (only desktop in header)
- Hamburger: 5×5 px, 3 lines, animate to X
- Side menu — same as Hero side menu

**Main:**
- `pt-12 md:pt-16 pb-20 px-8 md:px-10 max-w-[820px] lg:max-w-[1400px] mx-auto`

**Desktop two-column:**
- `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-32 xl:gap-40 lg:items-start`
- Left: text + form
- Right: enlarged map (`hidden lg:block lg:h-full lg:self-stretch`)

**Mobile single column:**
- Title: `text-[29px] md:text-[45px] font-light tracking-[0.04em] leading-none`
  - Font: `"Cormorant Garamond", serif`
- Intro: `mt-5 md:mt-6 text-[15px] md:text-[17px] font-light text-foreground/70 max-w-[520px]`
- Map (mobile only): `<section className="mb-8 lg:hidden"><MinimalMap /></section>`
- Contact info: same Footer-style icons + text
- "Start a project" form:
  - Heading Cormorant Garamond `text-[18px] md:text-[22px]`
  - Textarea: `border border-black/10 bg-white/60 px-4 py-3 text-[14px]`
  - Submit: `border border-black/20 px-5 py-3 text-[12px] uppercase tracking-[0.22em]`, hover invert
  - On submit: `mailto:` redirect

**Footer (in-page):**
- `mt-20 pt-10 border-t border-border text-center`
- Cormorant Garamond title `text-[20px] md:text-[24px]`
- Two taglines small caps

### 4.2 MinimalMap (`source/components/MinimalMap.tsx`)

- **Lib:** Leaflet (`leaflet`, CSS, marker icons)
- **Tiles:** `cartocdn.com/light_all` (subtle minimalist style)
- **Coords:** `41.7086, 44.8007` (Tbilisi default)
- Container: `relative z-0 isolate h-full min-h-[300px] overflow-hidden rounded-2xl border border-black/10`
- `scrollWheelZoom: false`

**Note:** Current Next.js იყენებს `GoogleMap.tsx`. მიგრაცია: Leaflet-ით ჩანაცვლება (T5.4-ში).

### 4.3 Contact Form section (Contact.tsx — embedded in homepage)

- სხვა ფორმა, `Contact.tsx` ცალკე homepage-isთვის (toast notification)
- ContactPage.tsx-ის ფორმა მარტივი mailto-ა
- Decision: ContactPage.tsx-ის ფორმა Next.js-ში გადადის (mailto-ით)

---

## 5. i18n Strategy

**Source:** ad-hoc `language === "ka"` ternaries (`useLanguage` from custom context)
**Target:** `next-intl` `useTranslations()` + `useLocale()`

**Required new i18n keys (proposal):**

```json
{
  "contact": {
    "title": "Contact" / "კონტაქტი",
    "intro": "We are open for collaboration..." / "ღია ვართ...",
    "cta": "Start a project" / "დაიწყე პროექტი",
    "form": {
      "placeholder": "Tell us about your project" / "მოგვიყევით თქვენი პროექტის შესახებ",
      "submit": "Send inquiry →" / "გაგზავნა →"
    }
  },
  "navigation": {
    "projects": "Projects" / "პროექტები",
    "architecture": "Architecture" / "არქიტექტურა",
    "urban": "Urban Planning" / "ურბანული დაგეგმარება",
    "about": "About" / "ჩვენ შესახებ",
    "contact": "Contact" / "კონტაქტი"
  },
  "site": {
    "tagline": "Architecture & urban planning" / "არქიტექტურა და ურბანული დაგეგმარება",
    "title": "URBAN SPACE"
  }
}
```

**Existing keys** to verify in `messages/{ka,en}.json` (already partial):
- `home.featured.*` (eyebrow, title)

---

## 6. Library / Asset Migration

| Item | Source | Target / Action |
|------|--------|-----------------|
| Routing | `react-router-dom` `Link`/`useLocation` | `next-intl/routing` `Link` + `usePathname` |
| Lang context | `@/contexts/LanguageContext` | `next-intl` `useLocale()`, `useTranslations()` |
| Icons | `lucide-react` (Menu, X, Plus, Minus, Mail, Phone, MapPin, Facebook, Instagram) | `lucide-react` (already installed — verify) |
| Map | `leaflet` + Carto tiles | `leaflet` ან `react-leaflet` (Next.js dynamic import — SSR სიფრთხილით) |
| Hooks | `use-swipe-menu`, `use-toast`, `useLocation` | Custom `use-swipe-menu` (port), `useToast` (already შესაძლოა აქვს), `usePathname` |
| Fonts | `"Inter"`, `"Cormorant Garamond"` | next/font ან Google Fonts CSS |
| Images | `@/assets/*.jpg` (static imports) | `next/image` + `/public/`-დან |

---

## 7. Color & Token System

Source heavily uses Tailwind `bg-secondary`, `text-foreground`, `bg-background`, `text-accent` etc. — შესაბამისი CSS vars. ჩასატარებელია:

- `globals.css`-ში tokens-ის გადაცემა / synced (თუ უკვე არ არის)
- Custom hex usage: `#F2F2F2`, `#777777`, `#222222`, `#8A8A8A` — Projects/SelectedWork-ში
- Mobile-specific: `border-foreground/10`, `bg-background/85`, `text-foreground/70`, `text-foreground/40` opacity scale

---

## 8. Mobile-Specific Behaviors (Need JS port)

| Behavior | Where | Status |
|----------|-------|--------|
| Hero parallax / scroll-driven logo morph | `Hero.tsx` lines 45-171 | Port full to `home/Hero.tsx` |
| `useSwipeMenu` (right-edge open menu) | `Hero.tsx`, `ContactHeader` | Port hook |
| `Navigation` swipe gestures | `Navigation.tsx` lines 22-60 | Port to `Navigation.tsx` |
| Background carousel 8s | `Hero.tsx` lines 38-43 | Port |
| Side menu projects collapse (Plus/Minus) | `Hero.tsx`, `ContactHeader` | Port |

---

## 9. Implementation Order (Recommendation)

1. **T5.1** ✅ (this audit)
2. **T5.4** Contact Page (mobile + desktop) — დამოუკიდებელი, მაღალი priority
3. **T5.5** Contact Admin Sync (ContactInfo model)
4. **T5.2** Mobile Home — Hero + Navigation + HomeNav + HomeFooter
5. **T5.3** Mobile Projects pages

**Justification:** Contact გვერდი ცალკეა და მთლიანი (mobile+desktop) — სუფთა task. Mobile home page უფრო რთულია JS scroll behaviors-ით.

---

## 10. Open Questions / Decisions Needed

1. **About section:** ჩავამატო თუ არა? (Current Next.js-ში არ არსებობს, source-ში კი არის)
2. **Cormorant Garamond font:** დავამატო next/font-ით? (ContactPage-ში გამოყენებული)
3. **Map library:** Leaflet (source) თუ Google Maps (current)? Source-ის სტილი ლამაზია — Leaflet-ით ჩავანაცვლო `GoogleMap.tsx`?
4. **Contact form:** mailto: (source) თუ POST API (current `ContactSubmission` model)? — ContactSubmission უკვე არსებობს Prisma-ში.

**მიდი T5.4-ით?** დაადასტურე გადაწყვეტილებები ➀-➃-ზე და დავიწყო.
