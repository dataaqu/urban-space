# Urban Space - ტექნოლოგიური სტეკი

## Frontend Framework
- **Next.js 14** — React-ზე დაფუძნებული full-stack ფრეიმვორკი (App Router)
- **React 18** — UI ბიბლიოთეკა
- **TypeScript** — ტიპიზირებული JavaScript

## სტილიზაცია
- **Tailwind CSS 3** — utility-first CSS ფრეიმვორკი
- **PostCSS** — CSS პრეპროცესორი
- **Autoprefixer** — CSS ავტო-პრეფიქსები

## ანიმაციები
- **Framer Motion** — React ანიმაციების ბიბლიოთეკა

## მონაცემთა ბაზა
- **PostgreSQL** — რელაციური მონაცემთა ბაზა
- **Prisma ORM** — მონაცემთა ბაზის ORM და მიგრაციების მართვა

## ინტერნაციონალიზაცია (i18n)
- **next-intl** — მრავალენოვანი მხარდაჭერა (ქართული / ინგლისური)

## შრიფტები
- **Inter** — ძირითადი sans-serif შრიფტი (Google Fonts)
- **Playfair Display** — სერიფიანი/დეკორატიული შრიფტი (Google Fonts)
- **Dachi the Lynx** — ლოკალური ქართული შრიფტი

## უტილიტები
- **clsx** — CSS კლასების კონდიციური შეერთება

## კოდის ხარისხი
- **ESLint** — კოდის ლინტერი (eslint-config-next)
- **ts-node** — TypeScript-ის პირდაპირ გაშვება (Prisma seed-ისთვის)

## პროექტის სტრუქტურა

```
src/
├── app/
│   ├── [locale]/          # ლოკალიზებული გვერდები (ka/en)
│   │   ├── studio/        # სტუდიის გვერდები
│   │   ├── services/      # სერვისების გვერდი
│   │   ├── projects/      # პროექტების გვერდი
│   │   └── contact/       # კონტაქტის გვერდი
│   └── api/               # API Routes
│       ├── contact/
│       ├── partners/
│       ├── projects/
│       ├── services/
│       └── team/
├── components/
│   ├── contact/           # კონტაქტის კომპონენტები (Google Map)
│   ├── layout/            # Header, Footer
│   ├── projects/          # პროექტების კომპონენტები
│   ├── services/          # სერვისების კომპონენტები
│   ├── studio/            # სტუდიის კომპონენტები
│   └── ui/                # ზოგადი UI კომპონენტები
├── hooks/                 # Custom React hooks
├── i18n/                  # ინტერნაციონალიზაციის კონფიგურაცია
├── lib/                   # Prisma client, უტილიტები, ანიმაციები
└── types/                 # TypeScript ტიპები
messages/
├── ka.json                # ქართული თარგმანები
└── en.json                # ინგლისური თარგმანები
prisma/
├── schema.prisma          # მონაცემთა ბაზის სქემა
└── seed.ts                # საწყისი მონაცემების სკრიპტი
```

## მონაცემთა ბაზის მოდელები
- **Project** — არქიტექტურული პროექტები (კატეგორიები: ARCHITECTURE, URBAN)
- **TeamMember** — გუნდის წევრები
- **Partner** — პარტნიორები
- **Service** — სერვისები
- **ContactSubmission** — საკონტაქტო ფორმის შეტყობინებები
- **SiteSettings** — საიტის პარამეტრები
