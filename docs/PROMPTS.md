# Prompt Template - Sewa Kamera Ryox
## Copy paste prompt ini ke AI (Hermes) saat mengerjakan task

**Note: Semua file dokumentasi ada di folder `docs/`**

---

## 🚀 PROMPT AWAL (WAJIB DIPAKAI PERTAMA KALI)

**Copy paste prompt ini PERTAMA KALI sebelum mulai kerja apapun:**

```
Halo, saya sedang mengerjakan project tugas akhir bernama "Sewa Kamera Ryox" - website SaaS rental kamera dengan CRUD.

Sebelum mulai kerja, tolong BACA DULU semua file dokumentasi project ini sebagai acuan:

1. Baca file docs/PRD.md - Product Requirements Document (berisi overview project, fitur, database schema, design system)
2. Baca file docs/STRUCTURE.md - Struktur Project (berisi folder structure, dependencies, install commands, tailwind config, biome config, image optimization)
3. Baca file docs/TASKS.md - Task Breakdown & Timeline (berisi semua task, timeline, dan agent assignment)
4. Baca file docs/PROMPTS.md - Prompt Template (berisi template prompt untuk setiap task)
5. Baca file docs/apple.com-DESIGN.md - Apple Design System (warna, typography, components, camera animation)
6. Baca file docs/ASSETS.md - Asset Guide (link Unsplash per kategori)

Setelah membaca semua file di atas, tolong pahami:
- Tech stack: Next.js 14 + Tailwind CSS + Framer Motion + shadcn/ui + Biome.js + Supabase + Midtrans Sandbox + AWS EC2
- Design: Apple-Inspired (clean, minimal, frosted glass navbar, generous whitespace)
- Nama project: Sewa Kamera Ryox
- Lokasi project: /Users/ryox/Documents/GitHub/uas-pemweb-teori/

Konfirmasi bahwa kamu sudah membaca dan memahami semua file di atas, lalu beritahu saya task apa yang harus dikerjakan pertama kali berdasarkan TASKS.md.
```

---

## 📋 PROMPT SETELAH MEMBACA (Mulai Kerja)

**Setelah AI konfirmasi sudah baca, pakai prompt ini:**

```
Bagus, kamu sudah membaca semua file dokumentasi. Sekarang mulai kerjakan Task 1.1: Project Setup.

Ikuti instruksi di docs/STRUCTURE.md bagian "Install Commands" dengan agent planner.

Pastikan kamu:
1. Berada di folder /Users/ryox/Documents/GitHub/uas-pemweb-teori/
2. Menjalankan: npx create-next-app@latest . --typescript --tailwind --app --src-dir
3. Menjalankan semua command install yang ada di STRUCTURE.md
4. Setup Tailwind config Apple-inspired
5. Setup .env.local
6. Setup shadcn/ui

Kerjakan sekarang dan beritahu saya hasilnya.
```

---

## Prompt Per Task

### Task 1.1: Project Setup
```
Kerjakan Task 1.1: Project Setup menggunakan agent planner dengan acuan:
- File: STRUCTURE.md (install commands & dependencies)
- Tech: Next.js 14, Tailwind CSS, shadcn/ui, Biome.js
- Command: 
  npx create-next-app@latest sewa-kamera-ryox --typescript --tailwind --app --src-dir
  npm install @supabase/supabase-js @supabase/ssr midtrans-client framer-motion lucide-react date-fns clsx tailwind-merge
  npm install -D @biomejs/biome
  npx @biomejs/biome init
  npx shadcn@latest init
- Setup Tailwind config Apple-inspired (lihat STRUCTURE.md)
- Setup .env.local
```

### Task 1.2: Supabase Setup
```
Kerjakan Task 1.2: Supabase Setup menggunakan agent database administrator dengan acuan:
- File: PRD.md (Database Schema - Section 5)
- Buat tables: profiles, cameras, bookings, loyalty_cards, loyalty_history, payments
- Setup RLS policies
- Setup Storage bucket
- Buat seed data (5-10 kamera)
- Generate TypeScript types
```

### Task 1.3: Supabase Client Setup
```
Kerjakan Task 1.3: Supabase Client Setup menggunakan agent backend developer dengan acuan:
- File: STRUCTURE.md (src/lib/supabase/)
- Buat client.ts (browser) dan server.ts (SSR)
- Setup auth middleware
```

### Task 1.4: Auth System
```
Kerjakan Task 1.4: Auth System menggunakan agent backend developer + frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/(auth)/)
- File: PRD.md (Section 4.1 Authentication)
- Buat login page (/login)
- Buat register page (/register)
- Auth context/provider
- Redirect logic berdasarkan role
```

### Task 1.5: Layout & Navigation
```
Kerjakan Task 1.5: Layout & Navigation menggunakan agent ui ux designer + frontend developer dengan acuan:
- File: PRD.md (Design System - Section 8)
- File: STRUCTURE.md (src/components/layout/)
- Root layout dengan navbar & footer
- Navbar dengan frosted glass effect (Apple-inspired)
- Mobile responsive navigation
```

### Task 2.1: Landing Page
```
Kerjakan Task 2.1: Landing Page menggunakan agent ui ux designer + frontend developer dengan acuan:
- File: PRD.md (Design System - Section 8)
- File: STRUCTURE.md (src/components/landing/)
- Hero section dengan animasi kamera (Framer Motion + CSS 3D)
- Animasi: kamera rotate/muter using framer-motion
- Features, Popular Cameras, Testimonials, CTA sections
- Apple-inspired design: clean, minimal, generous whitespace
```

### Task 2.2: Camera Catalog
```
Kerjakan Task 2.2: Camera Catalog menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/components/cameras/)
- File: PRD.md (Section 4.3 Katalog Kamera)
- Camera listing page (/cameras)
- CameraCard, CameraGrid components
- Search & filter functionality
- Pagination
```

### Task 2.3: Camera Detail
```
Kerjakan Task 2.3: Camera Detail menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/cameras/[id]/)
- Camera detail page
- Image gallery
- Spesifikasi & pricing
- Availability check
- Booking form trigger
```

### Task 2.4: Booking Form
```
Kerjakan Task 2.4: Booking Form menggunakan agent frontend developer + backend developer dengan acuan:
- File: STRUCTURE.md (src/components/bookings/)
- Date picker component
- Duration & price calculation
- Booking confirmation dialog
```

### Task 3.1: User Dashboard
```
Kerjakan Task 3.1: User Dashboard menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/dashboard/)
- Dashboard layout dengan sidebar
- Stats cards
- Profile page (/dashboard/profile)
```

### Task 3.2: User Bookings
```
Kerjakan Task 3.2: User Bookings menggunakan agent frontend developer + backend developer dengan acuan:
- File: STRUCTURE.md (src/app/dashboard/bookings/)
- Bookings list page
- BookingCard component
- Cancel booking functionality
- Status tracking
```

### Task 3.3: Booking System
```
Kerjakan Task 3.3: Booking System menggunakan agent backend developer dengan acuan:
- File: PRD.md (Section 4.4 Sistem Pemesanan & Database Schema)
- Create booking ke Supabase
- Validasi ketersediaan
- Update stock kamera
- Integrasi loyalty card check
```

### Task 3.4: Loyalty Card System
```
Kerjakan Task 3.4: Loyalty Card System menggunakan agent backend developer + database administrator dengan acuan:
- File: PRD.md (Section 4.8 Loyalty Card System)
- File: STRUCTURE.md (src/components/loyalty/)
- Auto-create loyalty card saat booking pertama
- Progress bar (0/5 → 5/5)
- Auto-apply diskon 15% saat count = 5
- Reset count setelah diskon dipakai
```

### Task 3.5: Real-time Updates
```
Kerjakan Task 3.5: Real-time Updates menggunakan agent backend developer dengan acuan:
- Supabase Realtime subscription untuk bookings
- Realtime update ketersediaan kamera
```

### Task 4.1: Admin Dashboard
```
Kerjakan Task 4.1: Admin Dashboard menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/)
- Admin layout dengan sidebar
- Stats overview
- Recent bookings table
```

### Task 4.2: Admin - Camera Management
```
Kerjakan Task 4.2: Admin Camera Management menggunakan agent frontend developer + backend developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/cameras/)
- Camera list table
- Create camera form (image upload)
- Edit & delete camera
```

### Task 4.3: Admin - Booking Management
```
Kerjakan Task 4.3: Admin Booking Management menggunakan agent frontend developer + backend developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/bookings/)
- Bookings list dengan filter status
- Update booking status
```

### Task 4.4: Admin - Payment Management
```
Kerjakan Task 4.4: Admin Payment Management menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/payments/)
- Payment history list
- Filter by status
```

### Task 4.5: Admin - User Management
```
Kerjakan Task 4.5: Admin User Management menggunakan agent frontend developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/users/)
- Users list
- User detail view
```

### Task 4.6: Midtrans Integration
```
Kerjakan Task 4.6: Midtrans Integration menggunakan agent backend developer + security specialist dengan acuan:
- File: STRUCTURE.md (src/lib/midtrans/)
- File: PRD.md (Section 4.9 Payment System)
- Install: npm install midtrans-client
- Setup Midtrans Snap di .env.local
- API route /api/payment (create transaction)
- API route /api/payment/webhook (handle notification)
- Checkout page (/checkout/[bookingId])
- Payment status page (/payment/status)
- Retry payment functionality
```

### Task 4.7: Payment Flow Testing
```
Kerjakan Task 4.7: Payment Flow Testing menggunakan agent QA tester dengan acuan:
- File: PRD.md (Section 4.9 Payment Flow)
- Test sandbox payment (BCA VA, Mandiri VA, QRIS)
- Test webhook callback
- Test booking status update setelah bayar
```

### Task 5.1: AWS EC2 Setup
```
Kerjakan Task 5.1: AWS EC2 Setup menggunakan agent devops engineer dengan acuan:
- Launch EC2 instance (t3.small, Ubuntu)
- Install Node.js, npm
- Install & configure Nginx
- Setup SSL (Let's Encrypt)
```

### Task 5.2: Deployment
```
Kerjakan Task 5.2: Deployment menggunakan agent devops engineer dengan acuan:
- Push code ke GitHub
- Clone repo ke EC2
- Install dependencies & build
- Setup PM2 untuk process manager
- Configure environment variables
```

### Task 5.3: Final Testing
```
Kerjakan Task 5.3: Final Testing menggunakan agent QA tester dengan acuan:
- Test semua flow (register → browse → booking → bayar → admin)
- Fix bugs
- Responsive testing
```

### Task 5.4: Code Cleanup
```
Kerjakan Task 5.4: Code Cleanup menggunakan agent refactor dengan acuan:
- Run Biome format & lint
- Hapus unused code
- Optimize imports
```

### Task 5.5: Documentation
```
Kerjakan Task 5.5: Documentation menggunakan agent technical writer dengan acuan:
- Update README.md dengan:
  - Project description
  - Tech stack
  - Install commands
  - Environment variables
  - Features list
  - Screenshots
```

---

## Prompt untuk Melanjutkan Task

```
Lanjutkan mengerjakan Task [X] menggunakan agent [nama-agent] dengan acuan:
- File: [nama-file]
- Tech: [teknologi yang dipakai]
- [Detail spesifik task]
```

## Prompt untuk Fix Bug

```
Tolong fix bug di [nama-file/komponen]:
- Error: [pesan error]
- Lokasi: [file dan line number]
- Yang diharapkan: [behavior yang benar]
```

## Prompt untuk Refactor

```
Tolong refactor [nama-file/komponen] menggunakan agent refactor:
- [Yang mau di-improve]
- Pastikan tetap menggunakan Biome.js untuk formatting
- [Additional notes]
```

## Prompt untuk Deploy

```
Tolong deploy project Sewa Kamera Ryox menggunakan agent devops engineer:
- Target: AWS EC2
- Domain: [nama-domain atau IP]
- Pastikan SSL aktif
- Setup PM2 untuk process manager
```

---

---

## 🚀 PROMPT HYBRID LANDING PAGE + AI GEMINI

**Prompt untuk Hermes — copy paste ini untuk mulai eksekusi full plan:**

### Prompt Utama (Pertama Kali)

```
Saya ingin mengeksekusi Hybrid Landing Page rewrite plan yang ada di /Users/ryox/Documents/GitHub/uas-pemweb-teori/docs/HYBRID_LANDING_PLAN.md

Sebelum mulai, BACA DULU file tersebut secara lengkap. Pahami:
- 7 keputusan final yang sudah di-approve
- Database schema (3 tables baru: wishlists, testimonials, faqs)
- Semua 22 files yang harus dibuat/diupdate
- Design system (Apple blue #0071E3)

LOKASI PROJECT: /Users/ryox/Documents/GitHub/uas-pemweb-teori/

Constraint (JANGAN PERNAH langgar):
- JANGAN ubah database schema existing (cameras, bookings, profiles, payments)
- JANGAN ubah API routes existing (/api/payments/midtrans/*)
- JANGAN ubah server actions existing
- JANGAN ubah auth flow
- JANGAN expose Gemini API key ke client (server-side proxy ONLY)
- Camera detail & checkout tetap pakai route existing /cameras/[id] & /checkout/[cameraId]
- Modal "Sewa Kamera Ini" → close modal + redirect ke /cameras/[id]
- Skip dark mode (light-only)
- UI language: Bahasa Indonesia
- Code style: no comments, concise
- Pakai token CSS existing (primary, text-dominant, surface-dark, border-black/10, dll)

Setelah baca, konfirmasi kamu paham. Lalu saya akan kasih prompt per-phase.
```

### Phase 0: Setup Environment

```
Sekarang kerjakan Phase 0: Setup Environment menggunakan agent planner.

Task:
1. Buka /Users/ryox/Documents/GitHub/uas-pemweb-teori/.env.local
2. Tambah line: GEMINI_API_KEY=AIzaSyAb8RN6IJC2M33JbP-iqkKI7FDpvDsA_XuR_H0noReJC4HhrbDA
3. Verifikasi .gitignore sudah include .env.local
4. Catat di AGENTS.md kalau sudah selesai

Konfirmasi setelah selesai.
```

### Phase 1: Database Migrations

```
Sekarang kerjakan Phase 1: Database Migrations menggunakan agent database administrator.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian Database Schema
2. Buat 3 file migration SQL:
   - supabase/migrations/XXXX_wishlists.sql
   - supabase/migrations/XXXX_testimonials.sql  
   - supabase/migrations/XXXX_faqs.sql
3. RUN migration via Supabase MCP atau Supabase Dashboard
4. Verify tables created + RLS policies active
5. Insert seed data (3 testimonials, 4 FAQs) lewat dashboard

Konfirmasi setelah semua table terbuat.
```

### Phase 2: API Routes

```
Sekarang kerjakan Phase 2: API Routes menggunakan agent backend developer.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian API Routes
2. Buat file: src/app/api/ai/gemini/route.ts
   - Server-side Gemini proxy dengan exponential retry
   - Baca GEMINI_API_KEY dari process.env
   - Forward prompt ke Gemini 2.5 Flash API
   - Return response sebagai JSON
3. Buat file: src/app/api/wishlist/route.ts
   - GET /api/wishlist → list wishlist user
   - POST /api/wishlist { cameraId } → add to wishlist
   - DELETE /api/wishlist?cameraId=xxx → remove from wishlist
   - Semua endpoint harus auth guard (supabase.auth.getUser())

Lint dengan biome dan pastikan tidak ada error TypeScript.
```

### Phase 3: Library Helpers

```
Sekarang kerjakan Phase 3: Library Helpers menggunakan agent backend developer.

Task:
1. Buat file: src/lib/gemini.ts
   - export async function callGeminiAI(prompt, systemPrompt?)
   - Panggil POST /api/ai/gemini
   - Return response.result (string)
   - Throw error kalau gagal
2. Buat file: src/lib/wishlist.ts
   - export async function getWishlist()
   - export async function addToWishlist(cameraId)
   - export async function removeFromWishlist(cameraId)
   - Semua panggil /api/wishlist

Lint dengan biome.
```

### Phase 4: Shared Components

```
Sekarang kerjakan Phase 4: Shared Components menggunakan agent ui ux designer + frontend developer.

Task:
1. Buat file: src/components/shared/Toast.tsx
   - ToastProvider component (context provider untuk toast notifications)
   - useToast() hook (show function)
   - Fixed bottom-right position
   - Auto dismiss 4 detik
   - Types: success (emerald), info (zinc), error (red)
   - Pakai lucide-react icon Sparkle + X
2. Buat file: src/components/shared/WishlistDrawer.tsx
   - Slide-in panel dari kanan
   - Props: open, onClose
   - Fetch wishlist dari /api/wishlist
   - Tampilkan camera image + name + brand + price
   - Tombol remove (X)
   - Empty state
   - Loading state
   - Backdrop blur overlay

Pastikan styling pakai token CSS existing (bg-white, text-text-dominant, border-black/10, dll).
Lint dengan biome.
```

### Phase 5: Landing Sections (Batch 1 — Hero + AI)

```
Sekarang kerjakan Phase 5 Batch 1: HeroSearch + AIAssistant + AIBudgetPlanner menggunakan agent frontend developer.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian HeroSearch, AIAssistant, AIBudgetPlanner
2. Buat file: src/components/landing/HeroSearch.tsx
   - Client component
   - Hero dengan search bar, stats (100%, 48 Jam, 15% Off)
   - Props: searchQuery, onSearchChange, onSearch
   - Apple blue gradient glow
3. Buat file: src/components/landing/AIAssistant.tsx
   - Client component
   - Input form untuk deskripsi proyek
   - Quick scenario buttons (4 skenario)
   - Panggil callGeminiAI() dari lib/gemini
   - Tampilkan response di panel kanan
   - Loading, empty, error states
   - Scroll to catalog button
   - Gunakan useToast() untuk feedback
4. Buat file: src/components/landing/AIBudgetPlanner.tsx
   - Client component
   - Budget range slider (Rp 400k - Rp 5jt)
   - Duration picker (1/2/3/5/7 hari)
   - Project type dropdown
   - Fetch real cameras dari Supabase untuk context AI
   - Panggil callGeminiAI() dengan inventory context
   - Tampilkan plan di panel kanan
   - Dark section background (bg-zinc-900)
   - Loading, empty, error states

Lint dengan biome.
```

### Phase 5: Landing Sections (Batch 2 — Catalog + Modal)

```
Sekarang kerjakan Phase 5 Batch 2: CatalogSection + CameraDetailModal menggunakan agent frontend developer.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian CatalogSection & CameraDetailModal
2. Buat file: src/components/landing/CatalogSection.tsx
   - Client component
   - Props: initialCameras, brands, types
   - Search bar, brand filter, sort by, category pills, price range slider
   - Camera grid (3 kolom)
   - Wishlist toggle (heart button) — call addToWishlist/removeFromWishlist
   - Camera card: image, brand pill, wishlist heart, type, name, price, availability badge
   - Pagination (6 items/page)
   - Empty state dengan reset filter button
   - Loading state (skeleton loader)
   - Klik card → buka CameraDetailModal
3. Buat file: src/components/landing/CameraDetailModal.tsx
   - Client component
   - Props: camera, onClose
   - Full-screen modal dengan backdrop blur
   - 2 kolom: kiri image + availability, kanan detail + tabs
   - 4 tabs: Spesifikasi, Kalender, Diskon, Tanya AI
   - Tab Kalender: +/- rental days counter, mock calendar grid
   - Tab Diskon: loyalty card preview (5 stamps)
   - Tab AI: input + callGeminiAI() untuk konsultasi kamera
   - Tombol "Sewa Kamera Ini" → close modal + router.push(/cameras/[id])
   - Estimasi total price

Lint dengan biome.
```

### Phase 5: Landing Sections (Batch 3 — Static Sections)

```
Sekarang kerjakan Phase 5 Batch 3: WhyUs + TestimonialsCarousel + FAQAccordion + FinalCTA menggunakan agent frontend developer.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian WhyUs, TestimonialsCarousel, FAQAccordion, FinalCTA
2. Buat file: src/components/landing/WhyUs.tsx
   - Server/Client component (boleh server, no hooks needed)
   - 3 value cards: ShieldCheck, Award, Clock
   - Grid 3 kolom
3. Buat file: src/components/landing/TestimonialsCarousel.tsx
   - Client component
   - Fetch testimonials dari Supabase (table testimonials, is_visible = true)
   - Carousel dengan pagination dots
   - Quote, stars, name, role, project
4. Buat file: src/components/landing/FAQAccordion.tsx
   - Client component
   - Fetch FAQs dari Supabase (table faqs, is_visible = true, order by sort_order)
   - Accordion: click buka/tutup
   - Highlight active question with primary border
5. Buat file: src/components/landing/FinalCTA.tsx
   - Server component
   - Dark section dengan CTA
   - Link ke /cameras

Lint dengan biome.
```

### Phase 6: Wire Up

```
Sekarang kerjakan Phase 6: Wire Up menggunakan agent frontend developer.

Task:
1. Baca docs/HYBRID_LANDING_PLAN.md bagian Wire Up
2. UPDATE file: src/app/layout.tsx
   - Import ToastProvider dari @/components/shared/Toast
   - Wrap <ToastProvider> di dalam <AuthProvider>, di luar {children}
3. UPDATE file: src/components/layout/Navbar.tsx
   - Import WishlistDrawer dari @/components/shared/WishlistDrawer
   - Import Heart icon dari lucide-react
   - Tambah state: [wishlistOpen, setWishlistOpen] = useState(false)
   - Render Heart button (wishlist icon) setelah dark mode toggle
   - Render <WishlistDrawer> di akhir component
4. REWRITE file: src/app/page.tsx
   - Import semua landing section components
   - Fetch cameras dari Supabase (server-side)
   - Extract unique brands & types
   - Render: HeroSearch → AIAssistant → AIBudgetPlanner → CatalogSection → WhyUs → TestimonialsCarousel → FAQAccordion → FinalCTA
   - HeroSearch props dikosongin dulu (search state akan di-handle lain kali)

Lint dengan biome.
```

### Phase 7: Build Test

```
Sekarang kerjakan Phase 7: Build Test menggunakan agent QA tester.

Task:
1. Jalankan: npm run build
2. Jika ada error TypeScript, fix satu per satu
3. Jika ada warning, cek apakah perlu difix
4. Jika build success, jalankan: npm run dev
5. Buka browser di http://localhost:3000
6. Lakukan visual check:
   - Landing page tampil lengkap (Hero, AI Assistant, AI Budget, Catalog, Why Us, Testimonials, FAQ, CTA)
   - HeroSearch search bar berfungsi
   - Catalog filter/sort/pagination berfungsi
   - Wishlist add/remove berfungsi (login dulu)
   - CameraDetailModal muncul saat klik card
   - AI Assistant & Budget Planner bisa dipanggil (test dengan input sederhana)
   - Toast notification muncul
   - Responsive di mobile view
7. Report hasil test

Kalau ada error, fix dulu sampai build success.
```

## Skills untuk Hybrid Landing Page

| Phase | Skill | Alasan |
|-------|-------|--------|
| Phase 1 | supabase | Database migration, RLS |
| Phase 2 | backend developer | API routes (Gemini proxy, Wishlist) |
| Phase 3 | backend developer | Library helpers |
| Phase 4 | ui ux designer, frontend developer | Shared components (Toast, WishlistDrawer) |
| Phase 5 | frontend developer | Landing sections (Hero, AI, Catalog, Modal) |
| Phase 6 | frontend developer | Wire up layout + page.tsx |
| Phase 7 | QA tester | Build test + visual verification |

## Skills yang Sudah Diinstall

| Skill | Kegunaan untuk Project |
|-------|------------------------|
| **ui-ux-pro-max** | Design Apple-inspired UI |
| **emil-design-eng** | Design engineering (Vercel designer) |
| **review-animations** | Review animasi kamera |
| **animation-vocabulary** | Vocab untuk Framer Motion |
| **emilkowalski-motion** | Motion design |
| **high-end-visual-design** | Premium visual design |
| **supabase** | Backend, auth, database |
| **saas-builder** | SaaS project structure |
| **css-animations** | CSS 3D animations |
| **hyperframes-animation** | Advanced animations |

Skills ini sangat berguna! Terutama **supabase**, **saas-builder**, **ui-ux-pro-max**, dan **animation** skills.
