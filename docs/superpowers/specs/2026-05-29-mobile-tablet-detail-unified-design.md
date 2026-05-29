# მობილური + ტაბლეტი — პროექტის შიდა გვერდის ერთიანი ანკორებული ლეიაუთი

თარიღი: 2026-05-29
სტატუსი: დამტკიცებული დიზაინი (implementation plan მოსალოდნელია)
წინამორბედი: [2026-05-28-mobile-project-detail-consistency-design.md](2026-05-28-mobile-project-detail-consistency-design.md)
(ეს სპეცი აფართოებს წინას: მობილურს და ტაბლეტს **ერთ ვიზუალურ სტილში** აერთიანებს.)

## პრობლემა

პროექტის შიდა გვერდი (`/[locale]/projects/[id]`) `<1024px`-ზე არასტაბილურია:

1. **მობილური ≠ ტაბლეტი.** `md:`-ზე (768–1023px) ლეიაუთი სხვა რენდერინგზე გადახტება
   (`fill` side-by-side, `justify-start`), მობილური კი intrinsic `<img>`-ს და
   `justify-center`-ს იყენებს. ერთიდაიგივე გვერდი ორ მოწყობილობაზე ორნაირად ჩანს.
2. **ფოტო სხვადასხვა ტელეფონზე სხვა ადგილასაა** — `justify-center` + ცვალებადი
   ფოტოს სიმაღლე იწვევს იმას, რომ ფოტო და ღილაკი ეკრანის სიმაღლის მიხედვით სხვა-სხვა
   წერტილში ჩამოდის.
3. **სკროლ-პოზიციიდან დამოკიდებული განლაგება** — როცა პროექტების სიაში სქროლი ქვემოთაა,
   შიდა გვერდზე შესვლისას განლაგება განსხვავდება ცენტრიდან შესვლისგან (iOS address-bar /
   `dvh` არასტაბილურობა).

## სასურველი შედეგი (მომხმარებლის მოთხოვნა)

ერთიანი სტილი მობილურსა და ტაბლეტზე. ვერტიკალური სტრუქტურა ზემოდან ქვემოთ:

- **CLOSE ღილაკი** — ფიქსირებული, ერთ წერტილზე ყველა დროს, არ მოძრაობს.
- **ფოტოს ზონა** — ეკრანის ცენტრში; 1 ან 2 ფოტო.
- **(მხოლოდ slide 0)** — სათაური + აღწერა, ფოტოსა და ღილაკს შორის.
- **პროექტის ინფორმაციის ღილაკი** — ერთ წერტილზე ყველა slide-ზე.

## Root cause

`src/components/projects/ProjectDetailClient.tsx`:
- ცენტრალური სვეტი: base `justify-center` ↔ `md:justify-start` — ორი სხვადასხვა ვერტიკალური
  მექანიკა.
- ფოტოს რენდერინგი ორ ცალკე განშტოებად: base intrinsic `<img>` + `imgMaxH` cap;
  `md:`/`lg:` `fill` (1 ფოტო) ან side-by-side (2 ფოტო).
- `ResponsiveProjectImage` შიგნით mobile↔desktop წყაროს `md:`-ზე ცვლის → ტაბლეტი desktop
  სურათს ხედავს, რაც ერთიან ვიზუალს არღვევს.

## გადაწყვეტა — Anchored ერთიანი `<lg` ლეიაუთი

**პრინციპი:** ყველაფერი `<1024px` (mobile + tablet) იყენებს **ერთსა და იმავე** base
ლეიაუთს. `md:` განშტოებები სცენიდან/სვეტიდან ამოვა — `md` მემკვიდრეობით იღებს base-ს.
ვიზუალური გადართვა მხოლოდ `lg:`-ზე (desktop, ≥1024px), რომელიც **უცვლელი რჩება**.
ეს შეესაბამება პროექტის tablet-breakpoint კონტრაქტს (mobile = `<1024px` ვიზუალის წყარო).

### Anchored ვერტიკალური სტრუქტურა (flex column)

```
┌──────────────────────────┐
│ CLOSE             fixed   │  ← fixed top, არ მოძრაობს
│ · dots            fixed   │
│ ┌──────────────────────┐ │
│ │  ფოტო(ები)  flex-1    │ │  ← items-center justify-center, object-contain
│ │  ცენტრში             │ │     ეკრანის სიმაღლის სხვაობას ეს ზონა შთანთქავს
│ └──────────────────────┘ │
│ [ სათაური + აღწერა ]      │  ← ფიქსირებული reserved min-height ყველა slide-ზე
│  (ჩანს მხოლოდ slide 0)    │     (slide 1+ ცარიელია, სიმაღლე იგივე)
│   INFO ───        fixed-ish│  ← ფიქსირებული სიმაღლის ზონა ბოლოში
└──────────────────────────┘
```

### ზუსტი ცვლილებები

ფაილი: `src/components/projects/ProjectDetailClient.tsx`

1. **`<main>` სიმაღლე** — უცვლელი. `visualViewport.height − header` JS გაზომვა რჩება
   (ეს ასწორებს სკროლ-პოზიციიდან შესვლის პრობლემას; `dvh`-ს არ ენდობა). `stageHeight`
   რჩება.

2. **ცენტრალური სვეტი** (ხაზი ~270): base `justify-center` → `justify-start`; ამოვა
   `md:justify-start`, `md:pt-6`, `md:pb-5` (base padding-ი ვრცელდება `<lg`-ზე).
   `short-landscape:` კლასები უცვლელი.

3. **ფოტოს ზონა** = ერთიანი `flex-1 min-h-0 w-full`, `flex items-center justify-center`.
   ამოვა base `shrink-0` და `md:h-auto md:flex-1` განსხვავება (უკვე `flex-1` იქნება ყველგან).

4. **1-ფოტოიანი** — ერთი ვარიანტი `<lg`-ზე: `relative h-full w-full` container +
   `ResponsiveProjectImage fill object-contain switchAt="lg"`. ამოვა base intrinsic `<img>`
   + `imgMaxH`. `lg:` ვარიანტი იგივე `fill` (უცვლელი).

5. **2-ფოტოიანი** — `<lg`: ვერტიკალურად დაწყობილი (მობილურის სტილი), ერთიანი ყველა
   `<lg`-ზე: `flex flex-col gap-3 h-full`, თითო ფოტო `relative flex-1` (≈50%) +
   `fill object-contain switchAt="lg"`. `lg:`-ზე side-by-side (უცვლელი, `hidden lg:flex`).
   ამოვა მობილურის intrinsic `<img>` ვარიანტი და `md:`→`lg:` გადაერთვება side-by-side-ზე.

6. **სათაური/აღწერის ზონა** (ხაზი ~362) — რჩება ფიქსირებული `min-height` ყველა slide-ზე
   (`min-h-[80px]`-ის რიგის; საბოლოო რიცხვი implementation-ში დაზუსტდება ისე, რომ
   ტიპური აღწერა დაეტიოს). `md:min-h-[64px]` → ერთიანდება `<lg`-ისთვის. ტექსტი მხოლოდ
   `activeIndex === 0`-ზე (უცვლელი).

7. **INFO ღილაკი** (ხაზი ~386) — ფიქსირებული სიმაღლის ზონა, ბოლოში. `md:` ვარიანტები
   ერთიანდება `<lg`-ისთვის. ლოგიკა უცვლელი.

8. **CLOSE ღილაკი / dots** — `fixed` რჩება. `<lg`-ის პოზიცია ერთიანდება (აღარ
   იქნება ცალკე base vs `md:` წერტილი). `lg:` და `short-landscape:` უცვლელი.

ფაილი: `src/components/projects/ResponsiveProjectImage.tsx`

9. ემატება არასავალდებულო პროპი `switchAt?: 'md' | 'lg'` (default `'md'`). default
   ქცევა არსებული გამოყენებებისთვის (SelectedWork, ProjectsClient) **ბაიტ-ბაიტ უცვლელია**.
   `switchAt="lg"`-ზე შიდა mobile↔desktop გადართვა `lg:hidden` / `hidden lg:block` ხდება,
   რათა ტაბლეტი მობილურის სურათს აჩვენებდეს.

## მკაცრი ფარგლები (Scope)

**იცვლება მხოლოდ:**
- `src/components/projects/ProjectDetailClient.tsx` — `<lg` (base) ლეიაუთი.
- `src/components/projects/ResponsiveProjectImage.tsx` — ახალი `switchAt` პროპი (additive).

**არ იცვლება (regression აკრძალულია):**
- desktop (`lg:`, ≥1024px) — drawer, side-by-side ფოტოები, განლაგება.
- `short-landscape:` (rotate) ვარიანტი — ბოლო commit-ების მუშაობა ხელუხლებელი.
- `SelectedWork.tsx`, `ProjectsClient.tsx` — `ResponsiveProjectImage`-ის default ქცევით.
- slide navigation (wheel/touch/keyboard), info drawer, ESC/scroll-lock, `visualViewport`
  გაზომვა (`stageHeight`).

## მისაღები შედეგის კრიტერიუმი

- 360–430px ტელეფონები (390×844, 393×852, 402×874, 430×932) და ტაბლეტი (768–1023px,
  მაგ. 820×1180) — **იდენტური სტრუქტურა**: CLOSE → ფოტო(ცენტრში) → (slide 0) სათაური →
  INFO ღილაკი.
- ფოტო ვერტიკალურად ცენტრშია ყველა მოწყობილობაზე.
- INFO ღილაკი ერთ წერტილზე ყველა slide-ზე (slide 0 ↔ slide 1+ არ ხტება).
- სქროლ-პოზიციიდან დამოუკიდებლად შესვლა — იგივე განლაგება.
- 2-ფოტო `<lg`-ზე ვერტიკალურად დაწყობილი; ტაბლეტი = მობილური.
- desktop და landscape **უცვლელი**.

## ვერიფიკაცია

- dev server, browser device-toolbar: 375×667, 390×844, 393×852, 402×874, 430×932,
  820×1180 — სტრუქტურა ერთნაირი; ფოტო ცენტრში; INFO ფიქსირებული slide-ებს შორის.
- სქროლი პროექტების სიაში ბოლომდე ჩამოწევა → შიდაში შესვლა → იგივე განლაგება ცენტრიდან
  შესვლასთან.
- ≥1024px desktop — ცვლილების გარეშე. landscape (rotate) — ცვლილების გარეშე.
- ორივე locale (ka/en), 1- და 2-ფოტოიანი პროექტი, info drawer ღია/დახურული.
- home (`SelectedWork`) და projects grid — `ResponsiveProjectImage` უცვლელად მუშაობს.
