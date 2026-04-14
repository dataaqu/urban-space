# Urban Space - Admin Panel V2 (Restructure)

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | Urban Space Admin Panel - Restructure |
| **Type** | Full-Stack Web App |
| **Status** | Planning |
| **Created** | 2026-04-14 |
| **Last Updated** | 2026-04-14 |
| **Progress** | 0/14 tasks (0%) |
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
- **Complexity**: High
- **Dependencies**: T2.1, T3.1
- **Description**:
  - `/admin/projects/new` ფორმის გადაკეთება:
    - სახელი (Ka/En)
    - კატეგორია (Architecture / Urban) dropdown
  - პროექტის შექმნისას ავტომატურად იქმნება პირველი გვერდი (SINGLE_IMAGE ტიპი)
  - Save ღილაკი → redirect პროექტის რედაქტირებაზე

#### T3.3: პროექტის რედაქტირების გვერდი - გვერდების მართვა
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - `/admin/projects` გვერდის განახლება
  - ცხრილი: სახელი, კატეგორია, გვერდების რაოდენობა, თარიღი
  - ფილტრაცია კატეგორიით (Architecture / Urban)
  - Edit / Delete ღილაკები

#### T4.3: ფრონტენდის პროექტის შიდა გვერდის გადაწყობა
- [ ] **Status**: TODO
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
- [ ] **Status**: TODO
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - Architecture/Urban გვერდების განახლება ახალი მონაცემთა სტრუქტურაზე
  - პროექტის thumbnail = პირველი გვერდის image1
  - სახელი და ლოკაცია ბმულით

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
- **Features:** 6 extracted
- **Tasks:** 14 generated
- **Phases:** 4 created
- **New Models:** ProjectPage (PageType enum)
