# Urban Space - Admin Panel

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | Urban Space Admin Panel |
| **Type** | Full-Stack Web App |
| **Status** | In Progress |
| **Created** | 2026-03-18 |
| **Last Updated** | 2026-03-18 |
| **Progress** | 18/19 tasks (95%) |
| **Plugin Version** | 1.1.1 |

### Description

ადმინ პანელის შექმნა Urban Space არქიტექტურული სტუდიის ვებსაიტისთვის. ადმინისტრატორს შეეძლება ყველა ტექსტური კონტენტის, სურათების, ლოგოს და დინამიური მონაცემების მართვა ორ ენაზე (ქართული/ინგლისური).

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
| Image Storage | Cloudinary |
| i18n | next-intl (ka/en) |

---

## Phase 1: Foundation - ავტორიზაცია და ინფრასტრუქტურა

### Overview
ადმინ პანელის საფუძვლის შექმნა: ავტორიზაცია, დაცული როუტები, Cloudinary ინტეგრაცია და ადმინ layout.

#### T1.1: NextAuth.js ინტეგრაცია
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: None
- **Description**:
  - NextAuth.js-ის დაყენება და კონფიგურაცია
  - Credentials Provider (email/password) დაყენება
  - Admin მომხმარებლის მოდელის დამატება Prisma სქემაში (email, hashedPassword, name, role)
  - JWT session strategy კონფიგურაცია
  - Seed სკრიპტი საწყისი ადმინ მომხმარებლისთვის
  - bcrypt პაროლის ჰეშირებისთვის

#### T1.2: ადმინ Middleware და Route Protection
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.1
- **Description**:
  - Middleware შექმნა `/admin` როუტების დასაცავად
  - არაავტორიზებული მომხმარებლების redirect login გვერდზე
  - Session validation ყველა API endpoint-ისთვის
  - CSRF protection

#### T1.3: ადმინ Login გვერდი
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.1
- **Description**:
  - `/admin/login` გვერდის შექმნა
  - Login ფორმა (email + password)
  - Error handling (არასწორი მონაცემები)
  - Redirect dashboard-ზე წარმატებული login-ის შემდეგ

#### T1.4: ადმინ Layout და Dashboard
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.2
- **Description**:
  - ადმინ პანელის layout (sidebar navigation, header with user info)
  - Dashboard გვერდი სტატისტიკით (პროექტების რაოდენობა, წაუკითხავი შეტყობინებები, გუნდის წევრები)
  - Logout ფუნქციონალი
  - Responsive design (mobile sidebar)

#### T1.5: Cloudinary ინტეგრაცია
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: None
- **Description**:
  - Cloudinary SDK-ის დაყენება და კონფიგურაცია
  - Reusable ImageUpload კომპონენტის შექმნა (drag & drop, preview)
  - API route სურათის ატვირთვისთვის (`/api/admin/upload`)
  - სურათის წაშლის ფუნქციონალი
  - Auto-optimization (format, quality, resize)

#### T1.6: Content მოდელის დამატება DB-ში
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: None
- **Description**:
  - Prisma სქემაში `SiteContent` მოდელის დამატება (key, section, valueKa, valueEn, type: TEXT/IMAGE/RICH_TEXT)
  - `HeroSlide` მოდელი (image, titleKa, titleEn, order)
  - `SiteSettings` მოდელის გაფართოება (logo, favicon)
  - Migration გაშვება
  - Seed სკრიპტი არსებული messages JSON-დან მონაცემების DB-ში გადასატანად

---

## Phase 2: Core - კონტენტის მართვა

### Overview
ძირითადი CRUD ოპერაციები: პროექტები, ტექსტური კონტენტი, სურათები.

#### T2.1: პროექტების მართვა - სია და წაშლა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.4
- **Description**:
  - `/admin/projects` გვერდი პროექტების ცხრილით
  - ფილტრაცია (კატეგორია, ტიპი, სტატუსი)
  - ძებნა სახელით
  - პროექტის წაშლა (confirmation dialog)
  - Pagination

#### T2.2: პროექტის დამატება/რედაქტირება
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T1.5, T2.1
- **Description**:
  - `/admin/projects/new` და `/admin/projects/[id]/edit` გვერდები
  - ფორმა ყველა ველით (titleKa/En, descriptionKa/En, category, type, status, year, location, area, featured)
  - მრავალი სურათის ატვირთვა Cloudinary-ში
  - სურათების რიგის შეცვლა (drag & drop reorder)
  - Slug-ის ავტომატური გენერაცია
  - Form validation

#### T2.3: Hero სლაიდერის მართვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.5, T1.6
- **Description**:
  - `/admin/hero` გვერდი
  - სლაიდების სია drag & drop რიგის შეცვლით
  - სლაიდის დამატება (სურათი + ტექსტი Ka/En)
  - სლაიდის რედაქტირება და წაშლა
  - Preview ფუნქციონალი

#### T2.4: ტექსტური კონტენტის მართვა
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T1.6
- **Description**:
  - `/admin/content` გვერდი სექციებით (Home, Studio, Contact, Footer)
  - თითოეული სექციისთვის inline editing (Ka/En)
  - ტექსტის ტიპები: მოკლე ტექსტი, გრძელი ტექსტი (textarea)
  - ცვლილებების შენახვა (save/discard)
  - Content sections: hero.title, hero.subtitle, hero.description, studio.about, footer.cta, და სხვა

#### T2.5: ლოგოს და საიტის პარამეტრების მართვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.5, T1.6
- **Description**:
  - `/admin/settings` გვერდი
  - ლოგოს ატვირთვა/ცვლილება
  - Favicon ატვირთვა
  - საკონტაქტო ინფორმაცია (მისამართი, ტელეფონი, email)
  - სოციალური ქსელების ბმულები (Facebook, Instagram)
  - Google Map კოორდინატები

---

## Phase 3: Advanced - დამატებითი მართვა

### Overview
გუნდი, პარტნიორები, სერვისები, კონტაქტ ინბოქსი.

#### T3.1: გუნდის წევრების მართვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.5, T1.4
- **Description**:
  - `/admin/team` გვერდი
  - წევრის დამატება (nameKa/En, positionKa/En, image)
  - რიგის შეცვლა (drag & drop)
  - რედაქტირება და წაშლა

#### T3.2: პარტნიორების მართვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.5, T1.4
- **Description**:
  - `/admin/partners` გვერდი
  - პარტნიორის დამატება (name, logo, website)
  - ლოგოს ატვირთვა
  - რიგის შეცვლა და წაშლა

#### T3.3: სერვისების მართვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.4
- **Description**:
  - `/admin/services` გვერდი
  - სერვისის დამატება (titleKa/En, descriptionKa/En, icon)
  - რიგის შეცვლა
  - რედაქტირება და წაშლა

#### T3.4: კონტაქტ შეტყობინებების ინბოქსი
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.4
- **Description**:
  - `/admin/messages` გვერდი
  - შეტყობინებების სია (თარიღით, სტატუსით)
  - წაკითხულად/წაუკითხავად მარკირება
  - შეტყობინების დეტალების ნახვა
  - წაშლა
  - Dashboard-ზე წაუკითხავი შეტყობინებების counter

#### T3.5: About გვერდის კონტენტი
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T2.4
- **Description**:
  - Studio about სექციის ტექსტების მართვა (mission, vision, paragraphs)
  - About გვერდის სურათის ცვლილება
  - Principles სექციის რედაქტირება (4 პრინციპი: title + description Ka/En)

---

## Phase 4: Integration - ფრონტენდთან დაკავშირება

### Overview
ფრონტენდის გადაწყობა DB კონტენტის გამოყენებაზე, ტესტირება.

#### T4.1: ფრონტენდის გადაწყობა - DB კონტენტი
- [x] **Status**: DONE
- **Complexity**: High
- **Dependencies**: T2.4, T1.6
- **Description**:
  - Home გვერდის კომპონენტების გადაწყობა DB-დან კონტენტის წამოსაღებად
  - Hero კომპონენტის გადაწყობა HeroSlide მოდელზე
  - Footer კომპონენტის გადაწყობა DB კონტენტზე
  - Studio გვერდების გადაწყობა
  - Contact info DB-დან SiteSettings-იდან
  - next-intl fallback: DB content პრიორიტეტით, JSON fallback

#### T4.2: ლოგოს დინამიური ჩვენება
- [x] **Status**: DONE
- **Complexity**: Low
- **Dependencies**: T2.5
- **Description**:
  - Header-ში ლოგოს DB/Cloudinary-დან ჩვენება
  - Footer-ში ლოგო
  - Favicon დინამიური ჩატვირთვა
  - Fallback default ლოგოზე

#### T4.3: სურათების ოპტიმიზაცია
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T4.1
- **Description**:
  - Next.js Image კომპონენტთან Cloudinary URL-ების ინტეგრაცია
  - Responsive images (srcset)
  - Lazy loading
  - Blur placeholder-ები

#### T4.4: API Endpoints-ის დაცვა
- [x] **Status**: DONE
- **Complexity**: Medium
- **Dependencies**: T1.2
- **Description**:
  - ყველა admin API endpoint-ის დაცვა session validation-ით
  - POST/PUT/DELETE ენდპოინტებისთვის auth middleware
  - Rate limiting
  - Input validation და sanitization

#### T4.5: ტესტირება და Deploy
- [ ] **Status**: TODO
- **Note**: მზადაა ტესტირებისთვის. ფუნქციონალი დასრულებულია.
- **Complexity**: Medium
- **Dependencies**: T4.1, T4.2, T4.3, T4.4
- **Description**:
  - ადმინ პანელის ფუნქციონალური ტესტირება
  - Mobile responsiveness ტესტი
  - Image upload/delete ტესტი
  - Auth flow ტესტი
  - Production deployment (environment variables)

---

## Original Specification Analysis

**Source:** მომხმარებლის მოთხოვნა (ვერბალური)

### Extracted Requirements
- ადმინ პანელი საიტის კონტენტის მართვისთვის
- სურათების ცვლილება (Hero, Projects, Team, Partners, About)
- ტექსტური ცვლილება (ყველა გვერდზე, ორ ენაზე)
- ლოგოს ცვლილება
- ავტორიზაცია (შესასვლელი მონაცემები)

### Clarifications Made
- **Auth:** NextAuth.js (Credentials Provider) — მომხმარებლის არჩევანი
- **Image Storage:** Cloudinary — მომხმარებლის არჩევანი
- **Content Management:** DB-ში გადატანა — მომხმარებლის არჩევანი

### Summary Statistics
- **Features:** 9 extracted
- **Tasks:** 19 generated
- **Phases:** 4 created
- **Estimated Models:** Admin, SiteContent, HeroSlide + existing models
