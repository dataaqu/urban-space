# Urban Space - Admin Panel V2 (Restructure)

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | Urban Space Admin Panel - Restructure |
| **Type** | Full-Stack Web App |
| **Status** | In Progress |
| **Created** | 2026-04-14 |
| **Last Updated** | 2026-05-28 |
| **Progress** | 31/32 tasks (97%) |
| **Plugin Version** | 1.1.1 |

### Description

ადმინ პანელის რესტრუქტურიზაცია: ზედმეტი სექციების მოშორება (Dashboard, Team, Partners, Messages, Settings, Content), პროექტების მართვის გადაკეთება გვერდი-ბეისიდ სისტემაზე, Tiptap rich text ედიტორის დამატება. პროექტს ექნება სახელი, კატეგორია და გვერდები (1-სურათიანი ან 2-სურათიანი).

### Target Users

- ადმინისტრატორი (საიტის მფლობელი/მენეჯერი)

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Auth | NextAuth.js (Credentials Provider) |
| Image Storage | Cloudflare R2 |
| Rich Text | Tiptap (ProseMirror) |
| i18n | next-intl (ka/en) |

---

## Phase 1: Cleanup - ზედმეტი სექციების მოშორება

### Overview
ადმინ პანელიდან ზედმეტი გვერდების, კომპონენტების, API routes-ის და sidebar ლინკების მოშორება. მხოლოდ Projects და Auth რჩება.

#### T1.1: Dashboard, Team, Partners, Messages, Settings, Content გვერდების წაშლა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: None
- **Description**:
  - წაშლა: `src/app/admin/(dashboard)/page.tsx` (dashboard)
  - წაშლა: `src/app/admin/(dashboard)/team/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/partners/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/messages/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/settings/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/content/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/hero/page.tsx`
  - წაშლა: `src/app/admin/(dashboard)/services/page.tsx`
  - Dashboard layout-ში default redirect `/admin/projects`-ზე

#### T1.2: შესაბამისი კომპონენტების და API routes-ის წაშლა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.1
- **Description**:
  - წაშლა: `src/components/admin/TeamManager.tsx`
  - წაშლა: `src/components/admin/PartnersManager.tsx`
  - წაშლა: `src/components/admin/ServicesManager.tsx`
  - წაშლა: `src/components/admin/MessagesInbox.tsx`
  - წაშლა: `src/app/api/admin/team/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/partners/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/services/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/messages/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/settings/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/content/` (ფოლდერი)
  - წაშლა: `src/app/api/admin/hero/` (ფოლდერი)

#### T1.3: AdminSidebar განახლება
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: T1.1
- **Description**:
  - Sidebar-დან ზედმეტი ლინკების მოშორება
  - დარჩენილი ნავიგაცია: Projects (list), New Project
  - Login-ის შემდეგ redirect `/admin/projects`-ზე (dashboard-ის ნაცვლად)

---

## Phase 2: DB Schema - ProjectPage მოდელი

### Overview
Prisma სქემის განახლება: Project მოდელის გამარტივება და ProjectPage მოდელის დამატება.

#### T2.1: Prisma Schema განახლება
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T1.2
- **Description**:
  - Project მოდელის გამარტივება:
    - დარჩენილი ველები: id, slug, titleKa, titleEn, category (ARCHITECTURE/URBAN), createdAt, updatedAt
    - მოსაშორებელი ველები: descriptionKa/En, type, images[], featured, featuredOrder, status, year, location, area
  - ახალი `ProjectPage` მოდელის შექმნა:
    ```
    model ProjectPage {
      id        String   @id @default(cuid())
      projectId String
      project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
      type      PageType // SINGLE_IMAGE, DOUBLE_IMAGE
      order     Int
      image1    String   // პირველი (ან ერთადერთი) სურათი
      image2    String?  // მეორე სურათი (მხოლოდ DOUBLE_IMAGE-ისთვის)
      textKa    String?  // ტექსტი ქართულად (მხოლოდ SINGLE_IMAGE-ისთვის)
      textEn    String?  // ტექსტი ინგლისურად (მხოლოდ SINGLE_IMAGE-ისთვის)
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    enum PageType {
      SINGLE_IMAGE
      DOUBLE_IMAGE
    }
    ```
  - პირველი გვერდი (hero): ავტომატურად იქმნება SINGLE_IMAGE ტიპით პროექტის შექმნისას
  - Migration გაშვება და ტესტი

---

## Phase 3: Rich Text & UI - Tiptap და ახალი ფორმები

### Overview
Tiptap ედიტორის ინტეგრაცია და პროექტის ახალი CRUD ინტერფეისის შექმნა.

#### T3.1: Tiptap Rich Text ედიტორის კომპონენტი
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: None
- **Description**:
  - `@tiptap/react`, `@tiptap/starter-kit` და საჭირო extensions-ის ინსტალაცია
  - Reusable `RichTextEditor` კომპონენტის შექმნა (`src/components/admin/RichTextEditor.tsx`)
  - ფუნქციონალი: Bold, Italic, Headings, Lists, Links
  - HTML output (შენახვა DB-ში)
  - Toolbar სტილიზაცია Tailwind-ით
  - Ka/En ტაბები ორ ენაზე ტექსტისთვის

#### T3.2: პროექტის შექმნის ფორმის გადაკეთება
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T2.1, T3.1
- **Description**:
  - `/admin/projects/new` ფორმის გადაკეთება:
    - სახელი (Ka/En)
    - კატეგორია (Architecture / Urban) dropdown
  - პროექტის შექმნისას ავტომატურად იქმნება პირველი გვერდი (SINGLE_IMAGE ტიპი)
  - Save ღილაკი → redirect პროექტის რედაქტირებაზე

#### T3.3: პროექტის რედაქტირების გვერდი - გვერდების მართვა
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T3.2
- **Description**:
  - `/admin/projects/[id]/edit` გვერდის გადაკეთება:
    - ზედა ნაწილი: პროექტის სახელი (Ka/En) და კატეგორია
    - ქვედა ნაწილი: გვერდების სია (ordered)
  - თითოეული გვერდისთვის:
    - ტიპის ჩვენება (1 სურათიანი / 2 სურათიანი)
    - Preview thumbnails
    - Edit / Delete ღილაკები
    - რიგის შეცვლა (up/down arrows)
  - "გვერდის დამატება" ღილაკი:
    - ტიპის არჩევა: "1 სურათიანი" ან "2 სურათიანი"
    - 1 სურათიანი: სურათის ატვირთვა + Tiptap ტექსტი (Ka/En)
    - 2 სურათიანი: 2 სურათის ატვირთვა

#### T3.4: გვერდის რედაქტირების მოდალი/ფორმა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T3.3
- **Description**:
  - გვერდის რედაქტირების modal ან inline form
  - SINGLE_IMAGE ტიპი:
    - სურათის შეცვლა (ImageUpload კომპონენტი)
    - ტექსტი Ka (Tiptap RichTextEditor)
    - ტექსტი En (Tiptap RichTextEditor)
  - DOUBLE_IMAGE ტიპი:
    - სურათი 1 (ImageUpload)
    - სურათი 2 (ImageUpload)
  - Save / Cancel ღილაკები

---

## Phase 4: API & Frontend - ბექენდი და ფრონტის განახლება

### Overview
API endpoints-ის განახლება და ფრონტენდის პროექტის გვერდის გადაწყობა ახალ მონაცემთა სტრუქტურაზე.

#### T4.1: API Routes განახლება
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T2.1
- **Description**:
  - `POST /api/admin/projects` - პროექტის შექმნა (name, category) + ავტომატური პირველი გვერდი
  - `PUT /api/admin/projects/[id]` - პროექტის სახელის/კატეგორიის განახლება
  - `DELETE /api/admin/projects/[id]` - პროექტის წაშლა (cascade pages)
  - `POST /api/admin/projects/[id]/pages` - გვერდის დამატება
  - `PUT /api/admin/projects/[id]/pages/[pageId]` - გვერდის განახლება
  - `DELETE /api/admin/projects/[id]/pages/[pageId]` - გვერდის წაშლა
  - `PUT /api/admin/projects/[id]/pages/reorder` - გვერდების რიგის შეცვლა

#### T4.2: პროექტების სიის გვერდის განახლება
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - `/admin/projects` გვერდის განახლება
  - ცხრილი: სახელი, კატეგორია, გვერდების რაოდენობა, თარიღი
  - ფილტრაცია კატეგორიით (Architecture / Urban)
  - Edit / Delete ღილაკები

#### T4.3: ფრონტენდის პროექტის შიდა გვერდის გადაწყობა
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T4.1
- **Description**:
  - `ProjectDetailClient.tsx` კომპონენტის განახლება:
    - მონაცემები ProjectPage მოდელიდან
    - პირველი გვერდი (hero): სურათი ცენტრში + ტექსტები გვერდებზე
    - შემდეგი გვერდები: SINGLE_IMAGE → სურათი + rich text, DOUBLE_IMAGE → 2 სურათი
    - პაგინაციის წერტილები
  - Public API endpoint `/api/projects/[id]` - პროექტის + გვერდების მიღება
  - Rich text HTML-ის რენდერინგი ფრონტზე

#### T4.4: პროექტების ლისტინგის გვერდის განახლება
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - Architecture/Urban გვერდების განახლება ახალი მონაცემთა სტრუქტურაზე
  - პროექტის thumbnail = პირველი გვერდის image1
  - სახელი და ლოკაცია ბმულით

---

## Phase 5: Mobile Style Port + Contact Page + Project Metadata

### Overview
ჰომ გვერდის მობილური სტილის და კონტაქტის გვერდის (mobile + desktop) გადატანა `urbanspace-site-latest`-დან Next.js ვერსიაში. ადმინ პანელში მობილური ფოტოს დამატების ფუნქციონალი და SINGLE_IMAGE გვერდის რესტრუქტურიზაცია (Tiptap ტექსტის ნაცვლად 7 metadata ფილდი).

### Source Reference
- მობილური სტილების წყარო: `urbanspace-site-latest/src/components/` (Hero, Navigation, About, Services, Projects, Footer)
- კონტაქტის გვერდის წყარო: `urbanspace-site-latest/src/pages/ContactPage.tsx` + `src/components/Contact.tsx` + `MinimalMap.tsx`
- მობილური breakpoint: Tailwind `md:` (< 768px)

#### T5.1: Style Audit — `urbanspace-site-latest`-ის მობილური და Contact სტილების კატალოგი
- [x] **Status**: DONE — იხ. `STYLE_AUDIT_T5.1.md`
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - მობილური ვერსიის სტილების ანალიზი source ფოლდერიდან:
    - Hero, Navigation (hamburger, swipe menu), SelectedWork/Projects, About, Services, Footer
  - კონტაქტის გვერდის სრული სტილის ანალიზი (mobile + desktop):
    - ContactPage layout, Contact info ბლოკი, MinimalMap, ფუთერი
  - დოკუმენტაცია: რომელი Tailwind classes გადადის რომელ Next.js კომპონენტში
  - i18n keys რომლებიც სჭირდება

#### T5.2: Mobile Styles Port — Home Page
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T5.1
- **Description**:
  - მთავარი გვერდის მობილური სტილის ცვლილება არსებულ Next.js კომპონენტებში:
    - `src/components/home/*` (Hero, About, Services, SelectedWork, Footer)
    - `src/components/layout/Navigation.tsx` (mobile menu, hamburger, swipe)
  - **მხოლოდ მობილური სტილი** იცვლება — დესკტოპი ხელუხლებელი
  - არსებული Prisma data layer და i18n keys-ის გამოყენება ცვლილებების გარეშე
  - `react-router` references → `next-intl/routing` adapt
  - Lucide icons თავსებადი

#### T5.3: Mobile Styles Port — Projects Listing + Detail
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T5.1
- **Description**:
  - `/projects` გვერდის მობილური სტილი (ProjectsClient, ProjectCard)
  - `/projects/[slug]` detail გვერდის მობილური სტილი (ProjectDetailClient)
  - მხოლოდ მობილური — დესკტოპის ცვლილება არ ხდება
  - არსებულ data layer-თან თავსებადი

#### T5.4: Contact Page UI Port (Mobile + Desktop)
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T5.1
- **Description**:
  - `/contact` route - სრული სტილი (mobile + desktop) source-დან
  - `src/components/contact/ContactLayout.tsx` რესტრუქტურიზაცია
  - კონტაქტის ინფო ბლოკი (phone, email, address, social)
  - `MinimalMap` ან არსებული `GoogleMap.tsx` ინტეგრაცია
  - Header და Footer source-ის სტილით
  - Lucide icons (Phone, Mail, MapPin, Facebook, Instagram)

#### T5.5: Contact Admin Sync — `ContactInfo` Model + Admin UI
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T5.4
- **Description**:
  - ახალი Prisma მოდელი `ContactInfo` (singleton):
    - `phone`, `email`, `addressKa`, `addressEn`, `mapEmbed`, `facebook`, `instagram`, `mapLat?`, `mapLng?`
  - Migration + seed საწყისი მონაცემებით
  - Admin route `/admin/contact` — კონტაქტის ინფოს რედაქტირება
  - API: `GET /api/contact`, `PUT /api/admin/contact`
  - Sidebar-ში "Contact" ლინკის დამატება
  - Frontend Contact page იღებს მონაცემებს DB-დან

#### T5.6: Prisma Schema — Mobile Image Fields
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: None
- **Description**:
  - `Project.mobileImage String?` ველის დამატება (featured image-ის mobile ვერსია)
  - `ProjectPage.mobileImage1 String?` და `mobileImage2 String?` ველების დამატება
  - Migration შექმნა და გაშვება
  - არსებული `featuredImage` / `image1` / `image2` ფილდები ხელუხლებელი

#### T5.7: Admin UI — Mobile Image Upload
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T5.6
- **Description**:
  - `ProjectForm.tsx`-ში "Mobile Image (optional)" ფილდი (ImageUpload კომპონენტი)
  - `ProjectPageEditor.tsx`-ში:
    - SINGLE_IMAGE: image1 + mobileImage1 (optional)
    - DOUBLE_IMAGE: image1, image2 + mobileImage1, mobileImage2 (all optional)
  - API endpoints განახლება (POST/PUT projects + pages) mobileImage სფეროების დასამუშავებლად
  - UI: მობილური ფოტოს preview და delete

#### T5.8: Frontend — Responsive Image Component
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T5.6, T5.7
- **Description**:
  - Reusable `<ResponsiveProjectImage>` კომპონენტი
  - Logic: მობილურზე → `mobileImage` თუ არსებობს, წინააღმდეგ შემთხვევაში → `desktopImage`
  - `<picture>` element ან Tailwind `md:hidden` / `hidden md:block` მიდგომა
  - Next.js Image component-ის შენარჩუნება optimization-ისთვის
  - გამოყენება: `ProjectCard`, `ProjectDetailClient`, `SelectedWork`

#### T5.9: Prisma Schema — ProjectPage Metadata Fields
- [x] **Status**: DONE — ახალი ფილდები დამატებულია; textKa/textEn შენარჩუნებულია T5.12-ის drop-მდე
- **Complexity**: High
- **Dependencies**: None
- **Description**:
  - `ProjectPage`-ში წაშლა: `textKa`, `textEn` (SINGLE_IMAGE-ის left text)
  - დამატება (ყველა String?, optional):
    - `architectsKa`, `architectsEn`
    - `metaLocationKa`, `metaLocationEn`
    - `typeKa`, `typeEn`
    - `statusKa`, `statusEn`
    - `areaKa`, `areaEn`
    - `clientKa`, `clientEn`
    - `year` (String — მაგ. "2024" ან "2024 - მიმდინარე")
  - **Note**: `textRightKa`/`textRightEn` ხელუხლებელი (DOUBLE_IMAGE-ისთვის ან რეზერვი)
  - Migration შექმნა და გაშვება

#### T5.10: Admin — SINGLE_IMAGE Editor Restructure (Tiptap → 7 Inputs)
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T5.9
- **Description**:
  - `ProjectPageEditor.tsx`-ში SINGLE_IMAGE ტიპზე Tiptap RichTextEditor-ის ჩანაცვლება 7 input ფილდით
  - Ka / En tabs (არსებული tab pattern-ით)
  - 7 input ველი თითოეულ ენაზე:
    - არქიტექტორები / Architects
    - მდებარეობა / Location
    - ტიპი / Type
    - სტატუსი / Status
    - შენობის ფართობი / Area
    - დამკვეთი / Client
    - წელი / Year (ერთი ფილდი — არ აქვს Ka/En)
  - ყველა optional
  - API განახლება: POST/PUT pages endpoints (textKa/textEn მოშორება, ახალი ფილდები)

#### T5.11: Frontend — Project Detail Metadata Rendering
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T5.10
- **Description**:
  - `ProjectDetailClient.tsx`-ის SINGLE_IMAGE გვერდის მარცხენა მხარეს 7 ფილდი
  - **Conditional render**: მხოლოდ შევსებული ფილდები ჩანს
  - Layout: Label / Value განლაგება (urbanspace-site-latest-ის სტილით)
  - i18n: `useLocale()`-ით `architectsKa` თუ `architectsEn` ვუჩვენოთ
  - `year` ფილდი ერთიანია (locale-agnostic)

#### T5.12: Data Migration — არსებული `textKa/textEn` → Structured Fields
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: T5.10, T5.11
- **Description**:
  - არსებული პროექტების `textKa`/`textEn` მონაცემების შეფასება
  - Migration script (Node.js) ან admin manual data entry — რაც უფრო მიზანშეწონილია
  - Backup DB migration-მდე
  - Old data → ახალი ფილდები გადანაწილება (architects, location, etc.)

---

## Phase 6: Mobile Style Refinement (1:1 urbanspace-site-latest port)

### Overview
არსებული Next.js მობილური ვერსია გავხადოთ იდენტური `urbanspace-site-latest`-ის — მხოლოდ შიდა გვერდების header-ი და პროექტის შიდა გვერდის transition სტილი. დესკტოპი ხელუხლებელი.

### Source Reference
- `urbanspace-site-latest/src/components/ProjectsHeader.tsx`
- `urbanspace-site-latest/src/pages/QobuletiProjectPage.tsx`
- `urbanspace-site-latest/src/pages/ProjectsPage.tsx` (FilterBar)
- `urbanspace-site-latest/src/hooks/use-swipe-menu.ts`

#### T6.1: Internal Pages Header — Mobile Style Refinement
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - Source: `ProjectsHeader.tsx` (lines 16-58 mobile portion)
  - Target: `src/components/layout/SiteHeader.tsx`
  - Mobile-only ცვლილებები (md:-ის ქვემოთ):
    - Logo: `text-[15px]` (current `text-[22px]`)
    - Tagline: `hidden md:block` — mobile header-ზე არ ჩანს
    - Lang toggle: `hidden md:inline-block` — header-ში მხოლოდ desktop, mobile-ზე side menu-ში
    - Padding: `px-8 py-4` (current `px-3 py-4`)
    - Hamburger box: `h-5 w-5` 3 lines, animation preserved
  - Desktop ვერსია სრულიად ხელუხლებელი

#### T6.2: Port `useSwipeMenu` Hook (Right-Edge Swipe)
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - Source: `urbanspace-site-latest/src/hooks/use-swipe-menu.ts`
  - Target: `src/hooks/useSwipeMenu.ts`
  - Touch swipe-from-right-edge logic (mobile only)
  - Integration: `SiteHeader.tsx`-ში გამოყენება — `useSwipeMenu(() => setMenuOpen(true), !menuOpen)`

#### T6.3: Project Detail Mobile — Single-Screen Slide System
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: None
- **Description**:
  - Source: `QobuletiProjectPage.tsx` (lines 109-200)
  - Target: `src/components/projects/ProjectDetailClient.tsx` mobile layout
  - **Replace** scroll-based framer-motion sections (current `flex-col h-full overflow-auto`) **with** single-screen slide system:
    - `<main className="h-screen overflow-hidden">` mobile-ზე
    - Image stage: fixed `h-[42vh]` shrink-0
    - Text area: `min-h-[80px]` shrink-0 (title + subtitle on first slide)
    - Image swap on `activeIndex` change (no scroll between slides)
  - Wheel/touch/keyboard handlers:
    - 450ms slide change lock (current 800ms)
    - Wheel `Math.abs(deltaY) < 10` ignore (current 5)
    - Touch threshold 40px (current 30)
  - Desktop layout (lg:flex) ხელუხლებელი
  - DOUBLE_IMAGE / SINGLE_IMAGE / IMAGE_ONLY mobile rendering ერგება slide-ის სტრუქტურას
  - PRESERVE: framer-motion entry animation, ResponsiveProjectImage, locale text, metadata data structure

#### T6.4: Project Detail Mobile — Bottom Drawer for Project Info
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T6.3
- **Description**:
  - Source: `QobuletiProjectPage.tsx` (lines 169-180 trigger button + lines 200-272 drawer)
  - Target: `ProjectDetailClient.tsx` mobile section
  - "Project Information" trigger button:
    - მე-3 fixed-height block ქვემოთ (`h-[60px]` shrink-0)
    - `inline-flex flex-col items-center` text + underline
    - Localized: "პროექტის ინფორმაცია" / "Project Information"
  - Bottom drawer:
    - `fixed inset-x-0 bottom-0 z-50 h-[50vh]`
    - `translate-y-full ↔ translate-y-0`, 500ms ease-out
    - Backdrop overlay (rgba 0,0,0,0.15)
    - Drag handle indicator: `h-1 w-10 rounded-full bg-foreground/20`
    - Close button (X icon)
    - ESC key close + click-backdrop close
    - Body scroll lock when drawer open (`document.body.style.overflow = "hidden"`)
  - Drawer content: არსებული metadata items (architects, location, type, status, area, client, year)
  - Reuse `getMetadataItems()` და `META_LABELS` უკვე არსებულს

#### T6.5: Project Detail Mobile — Vertical Pagination Dots Visible on Mobile
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: T6.3
- **Description**:
  - Source: `QobuletiProjectPage.tsx` (lines 184-198)
  - Target: `ProjectDetailClient.tsx` (currently `hidden lg:flex`, ხილვადია მხოლოდ lg+)
  - Mobile-ზე ხილვადი:
    - `fixed right-4 md:right-6 top-[42%] -translate-y-1/2 -mt-10 z-30 flex flex-col gap-3`
    - Size: `h-1 w-1 rounded-full`
    - Active: `bg-foreground scale-125`
    - Inactive: `bg-foreground/30 hover:bg-foreground/60`
    - Click → `goTo(i)`
  - Desktop ვერსია (current bigger dots `lg:flex` block) — შეიძლება შენარჩუნდეს ცალკე

#### T6.6: Project Detail Mobile — Close Button Styling
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: T6.3
- **Description**:
  - Source: `QobuletiProjectPage.tsx` (lines 115-120)
  - Target: `ProjectDetailClient.tsx` close link
  - Mobile position: `absolute right-4 top-[72px]` (header-ის ქვემოთ)
  - Style: `text-[10px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition`
  - Localized: `language === 'ka' ? 'დახურვა' : 'Close'`
  - Currently: `fixed top-[120px] right-6 text-[12px]` lowercase "close"

#### T6.7: Projects Listing — Sticky FilterBar Auto-hide on Scroll (Mobile)
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: None
- **Description**:
  - Source: `ProjectsPage.tsx` FilterBar component (lines 116-194)
  - Target: `src/components/projects/CategoryFilter.tsx` ან `ProjectsClient.tsx`
  - Sticky `top-[56px]` mobile / `top-[100px]` md+
  - Hide on scroll-down (threshold 4px), show on scroll-up
  - 1s idle timer auto-shows
  - `bg-background/85 backdrop-blur-md`
  - Active link underline: `h-px bg-foreground/60 w-1/2 ↔ w-0`

#### T6.8: Project Detail Mobile — Cross-Device Layout Consistency
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T6.3
- **Description**:
  - პრობლემა: მობილურზე პროექტის შიდა გვერდი სხვადასხვა ტელეფონზე სხვაგვარად ჩანს (iPhone 14 vs 17) — სასურველია ერთი, თანმიმდევრული განლაგება ყველა ტელეფონზე
  - Target: `src/components/projects/ProjectDetailClient.tsx` — **მხოლოდ მობილური (base) კლასები**
  - Spec: `docs/superpowers/specs/2026-05-28-mobile-project-detail-consistency-design.md`
  - Root cause: მობილური იყენებს `justify-center` + ფიქსირებულ `vh` სიმაღლეებს, fixed Close ღილაკთან ერთად → ცენტრი ცურავს ეკრანის სიმაღლის მიხედვით
  - მობილური გადადის იმავე ზემოდან-მიმაგრებულ `flex-1` განლაგებაზე, რომელსაც `md:` (ტაბლეტი) უკვე იყენებს:
    - container: base `justify-center` → `justify-start`
    - image stage: base `hasTwoImages ? h-[64vh] : h-[46vh]` → `flex-1 min-h-0`
    - 2-ფოტოიანი მობილური ბლოკი: `mt-[60px]` მოშორება; რჩება ვერტიკალურად დაწყობილი, თითო ფოტო `object-contain` + max-h cap
  - სათაური/აღწერა და INFO ღილაკი — უცვლელი (ფიქსირებული `min-h`/`h`)
  - **არ იცვლება**: `md:` (tablet), `lg:` (desktop), `short-landscape:`, dots, slide logic
- **Acceptance Criteria**:
  - iPhone 14/15/16/17 და 360–430px ტელეფონები იდენტურ განლაგებას აჩვენებენ (Close → ფოტო → სათაური → INFO)
  - ორივე სტილი (1- და 2-ფოტოიანი) ვიზუალურად უცვლელია
  - tablet (768–1023px) და desktop (≥1024px) regression-ის გარეშე

---

## Original Specification Analysis

**Source:** მომხმარებლის მოთხოვნა (ვერბალური, 2026-04-14)

### ძირითადი მოთხოვნები

1. **მოსაშორებელი სექციები:** Dashboard, Team, Partners, Messages, Settings, Content, Hero, Services
2. **პროექტის ახალი სტრუქტურა:**
   - სახელი (Ka/En) + კატეგორია (Architecture/Urban)
   - ძირითადი ინფორმაციის ველები (year, location, area, status, type) მოშორება
   - გვერდი-ბეისიდ სისტემა: 1-სურათიანი (სურათი + ტექსტი) ან 2-სურათიანი (2 სურათი)
3. **Rich Text ედიტორი:** Tiptap - ტექსტების მარტივი რედაქტირება
4. **Hero გვერდი:** ავტომატურად იქმნება პროექტის შექმნისას

### Clarifications Made
- **Rich Text ბიბლიოთეკა:** Tiptap (ProseMirror) — მომხმარებლის არჩევანი
- **Hero გვერდი:** ავტომატურად იქმნება — მომხმარებლის არჩევანი
- **არსებული გეგმა:** გადაწერა — მომხმარებლის არჩევანი

### Summary Statistics
- **Features:** 6 extracted (initial) + 6 added (Phase 5) + 7 added (Phase 6)
- **Tasks:** 14 (initial) + 12 (Phase 5) + 7 (Phase 6) = 33 total
- **Phases:** 4 (initial) + 1 (Phase 5) + 1 (Phase 6) = 6 total
- **New Models:** ProjectPage, ContactInfo (PageType enum)

---

## Phase 5 Specification Analysis

**Source:** მომხმარებლის მოთხოვნა (ვერბალური, 2026-05-08) + `urbanspace-site-latest` ფოლდერი

### ძირითადი მოთხოვნები

1. **მობილური ვერსიის სტილი:** `urbanspace-site-latest`-დან Home გვერდის მობილური სტილის გადატანა
2. **Contact გვერდი:** სრული სტილი (mobile + desktop), admin sync (ახალი `ContactInfo` მოდელი)
3. **მობილური ფოტო:** Project.featuredImage და ProjectPage.image1/image2-ისთვის optional mobile ვერსიები
4. **SINGLE_IMAGE რესტრუქტურიზაცია:** Tiptap left text → 7 structured input fields (architects, location, type, status, area, client, year × Ka/En; year — locale-agnostic)
5. **Conditional rendering:** ცარიელი ფილდები არ გამოჩნდება frontend-ზე

### Clarifications Made
- **Mobile breakpoint:** Tailwind `md:` (< 768px) — მომხმარებლის არჩევანი
- **Contact admin:** ახალი `ContactInfo` მოდელი — მომხმარებლის არჩევანი
- **`textKa`/`textEn` ფილდი:** წაშლა და structured ფილდებით ჩანაცვლება — მომხმარებლის არჩევანი
- **Year ფილდი:** String ტიპი — მომხმარებლის არჩევანი
- **Implementation start:** T5.6 (Prisma schema mobile image fields) — რეკომენდებული
