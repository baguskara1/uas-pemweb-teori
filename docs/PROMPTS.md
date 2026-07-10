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
Kerjakan Task 1.2: Supabase Setup menggunakan agent database-administrator dengan acuan:
- File: PRD.md (Database Schema - Section 5)
- Buat tables: profiles, cameras, bookings, loyalty_cards, loyalty_history, payments
- Setup RLS policies
- Setup Storage bucket
- Buat seed data (5-10 kamera)
- Generate TypeScript types
```

### Task 1.3: Supabase Client Setup
```
Kerjakan Task 1.3: Supabase Client Setup menggunakan agent backend-developer dengan acuan:
- File: STRUCTURE.md (src/lib/supabase/)
- Buat client.ts (browser) dan server.ts (SSR)
- Setup auth middleware
```

### Task 1.4: Auth System
```
Kerjakan Task 1.4: Auth System menggunakan agent backend-developer + frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/(auth)/)
- File: PRD.md (Section 4.1 Authentication)
- Buat login page (/login)
- Buat register page (/register)
- Auth context/provider
- Redirect logic berdasarkan role
```

### Task 1.5: Layout & Navigation
```
Kerjakan Task 1.5: Layout & Navigation menggunakan agent ui-ux-designer + frontend-developer dengan acuan:
- File: PRD.md (Design System - Section 8)
- File: STRUCTURE.md (src/components/layout/)
- Root layout dengan navbar & footer
- Navbar dengan frosted glass effect (Apple-inspired)
- Mobile responsive navigation
```

### Task 2.1: Landing Page
```
Kerjakan Task 2.1: Landing Page menggunakan agent ui-ux-designer + frontend-developer dengan acuan:
- File: PRD.md (Design System - Section 8)
- File: STRUCTURE.md (src/components/landing/)
- Hero section dengan animasi kamera (Framer Motion + CSS 3D)
- Animasi: kamera rotate/muter using framer-motion
- Features, Popular Cameras, Testimonials, CTA sections
- Apple-inspired design: clean, minimal, generous whitespace
```

### Task 2.2: Camera Catalog
```
Kerjakan Task 2.2: Camera Catalog menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/components/cameras/)
- File: PRD.md (Section 4.3 Katalog Kamera)
- Camera listing page (/cameras)
- CameraCard, CameraGrid components
- Search & filter functionality
- Pagination
```

### Task 2.3: Camera Detail
```
Kerjakan Task 2.3: Camera Detail menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/cameras/[id]/)
- Camera detail page
- Image gallery
- Spesifikasi & pricing
- Availability check
- Booking form trigger
```

### Task 2.4: Booking Form
```
Kerjakan Task 2.4: Booking Form menggunakan agent frontend-developer + backend-developer dengan acuan:
- File: STRUCTURE.md (src/components/bookings/)
- Date picker component
- Duration & price calculation
- Booking confirmation dialog
```

### Task 3.1: User Dashboard
```
Kerjakan Task 3.1: User Dashboard menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/dashboard/)
- Dashboard layout dengan sidebar
- Stats cards
- Profile page (/dashboard/profile)
```

### Task 3.2: User Bookings
```
Kerjakan Task 3.2: User Bookings menggunakan agent frontend-developer + backend-developer dengan acuan:
- File: STRUCTURE.md (src/app/dashboard/bookings/)
- Bookings list page
- BookingCard component
- Cancel booking functionality
- Status tracking
```

### Task 3.3: Booking System
```
Kerjakan Task 3.3: Booking System menggunakan agent backend-developer dengan acuan:
- File: PRD.md (Section 4.4 Sistem Pemesanan & Database Schema)
- Create booking ke Supabase
- Validasi ketersediaan
- Update stock kamera
- Integrasi loyalty card check
```

### Task 3.4: Loyalty Card System
```
Kerjakan Task 3.4: Loyalty Card System menggunakan agent backend-developer + database-administrator dengan acuan:
- File: PRD.md (Section 4.8 Loyalty Card System)
- File: STRUCTURE.md (src/components/loyalty/)
- Auto-create loyalty card saat booking pertama
- Progress bar (0/5 → 5/5)
- Auto-apply diskon 15% saat count = 5
- Reset count setelah diskon dipakai
```

### Task 3.5: Real-time Updates
```
Kerjakan Task 3.5: Real-time Updates menggunakan agent backend-developer dengan acuan:
- Supabase Realtime subscription untuk bookings
- Realtime update ketersediaan kamera
```

### Task 4.1: Admin Dashboard
```
Kerjakan Task 4.1: Admin Dashboard menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/)
- Admin layout dengan sidebar
- Stats overview
- Recent bookings table
```

### Task 4.2: Admin - Camera Management
```
Kerjakan Task 4.2: Admin Camera Management menggunakan agent frontend-developer + backend-developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/cameras/)
- Camera list table
- Create camera form (image upload)
- Edit & delete camera
```

### Task 4.3: Admin - Booking Management
```
Kerjakan Task 4.3: Admin Booking Management menggunakan agent frontend-developer + backend-developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/bookings/)
- Bookings list dengan filter status
- Update booking status
```

### Task 4.4: Admin - Payment Management
```
Kerjakan Task 4.4: Admin Payment Management menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/payments/)
- Payment history list
- Filter by status
```

### Task 4.5: Admin - User Management
```
Kerjakan Task 4.5: Admin User Management menggunakan agent frontend-developer dengan acuan:
- File: STRUCTURE.md (src/app/admin/users/)
- Users list
- User detail view
```

### Task 4.6: Midtrans Integration
```
Kerjakan Task 4.6: Midtrans Integration menggunakan agent backend-developer + security-specialist dengan acuan:
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
Kerjakan Task 4.7: Payment Flow Testing menggunakan agent qa-tester dengan acuan:
- File: PRD.md (Section 4.9 Payment Flow)
- Test sandbox payment (BCA VA, Mandiri VA, QRIS)
- Test webhook callback
- Test booking status update setelah bayar
```

### Task 5.1: AWS EC2 Setup
```
Kerjakan Task 5.1: AWS EC2 Setup menggunakan agent devops-engineer dengan acuan:
- Launch EC2 instance (t3.small, Ubuntu)
- Install Node.js, npm
- Install & configure Nginx
- Setup SSL (Let's Encrypt)
```

### Task 5.2: Deployment
```
Kerjakan Task 5.2: Deployment menggunakan agent devops-engineer dengan acuan:
- Push code ke GitHub
- Clone repo ke EC2
- Install dependencies & build
- Setup PM2 untuk process manager
- Configure environment variables
```

### Task 5.3: Final Testing
```
Kerjakan Task 5.3: Final Testing menggunakan agent qa-tester dengan acuan:
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
Kerjakan Task 5.5: Documentation menggunakan agent technical-writer dengan acuan:
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
Tolong deploy project Sewa Kamera Ryox menggunakan agent devops-engineer:
- Target: AWS EC2
- Domain: [nama-domain atau IP]
- Pastikan SSL aktif
- Setup PM2 untuk process manager
```

---

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
