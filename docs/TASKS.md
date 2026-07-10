# Task Breakdown & Timeline
## Sewa Kamera Ryox - Tanggal 8 s/d 12 Juli 2026

---

## Hari 1 - Selasa, 8 Juli (Foundation)
### 🎯 Agent: planner → architect → database-administrator → backend-developer

### Task 1.1: Project Setup (2.5 jam)
**🤖 Agent: planner**
- [ ] Pastikan kamu di folder `/Users/ryox/Documents/GitHub/uas-pemweb-teori/`
- [ ] `npx create-next-app@latest . --typescript --tailwind --app --src-dir`
- [ ] Install dependencies: supabase, lucide-react, date-fns, clsx, tailwind-merge
- [ ] Install Biome.js: `npm install -D @biomejs/biome`
- [ ] Initialize Biome: `npx @biomejs/biome init`
- [ ] Configure Biome (formatter + linter)
- [ ] Setup Tailwind config (Apple-inspired colors & fonts)
- [ ] Setup .env.local (SUPABASE_URL, SUPABASE_ANON_KEY, MIDTRANS_*)
- [ ] Setup shadcn/ui (`npx shadcn@latest init`)

### Task 1.2: Supabase Setup (2 jam)
**🤖 Agent: database-administrator**
- [ ] Buat project baru di Supabase Dashboard
- [ ] Buat database tables (profiles, cameras, bookings, loyalty_cards, loyalty_history, payments)
- [ ] Setup Row Level Security (RLS) policies
- [ ] Setup Storage bucket untuk foto kamera
- [ ] Buat seed data (5-10 kamera dummy)
- [ ] Generate TypeScript types dari Supabase

### Task 1.3: Supabase Client Setup (1 jam)
**🤖 Agent: backend-developer**
- [ ] Buat `src/lib/supabase/client.ts` (browser)
- [ ] Buat `src/lib/supabase/server.ts` (SSR)
- [ ] Setup auth middleware untuk protect routes

### Task 1.4: Auth System (2 jam)
**🤖 Agent: backend-developer + frontend-developer**
- [ ] Login page (`/login`) - frontend
- [ ] Register page (`/register`) - frontend
- [ ] Auth context/provider - backend
- [ ] Redirect logic berdasarkan role - backend
- [ ] Logout functionality - frontend

### Task 1.5: Layout & Navigation (1.5 jam)
**🤖 Agent: ui-ux-designer + frontend-developer**
- [ ] Root layout (navbar, footer) - ui-ux
- [ ] Navbar dengan frosted glass effect - frontend
- [ ] Mobile responsive navigation - frontend
- [ ] Biome format semua file - frontend

---

## Hari 2 - Rabu, 9 Juli (Core Features)
### 🎯 Agent: ui-ux-designer → frontend-developer

### Task 2.1: Landing Page (2.5 jam)
**🤖 Agent: ui-ux-designer + frontend-developer**
- [ ] Hero section dengan animasi kamera GIF/3D - ui-ux + frontend
- [ ] Cari GIF kamera (rotasi/muter) atau buat CSS animation - frontend
- [ ] Features section - frontend
- [ ] Popular cameras section (fetch dari Supabase) - frontend
- [ ] Testimonials section - frontend
- [ ] CTA section - frontend

### Task 2.2: Camera Catalog (CRUD Read) (2 jam)
**🤖 Agent: frontend-developer**
- [ ] Camera listing page (`/cameras`)
- [ ] CameraCard component
- [ ] CameraGrid layout
- [ ] Search functionality
- [ ] Filter by brand, type, price
- [ ] Pagination

### Task 2.3: Camera Detail (1.5 jam)
**🤖 Agent: frontend-developer**
- [ ] Camera detail page (`/cameras/[id]`)
- [ ] Image gallery
- [ ] Spesifikasi & pricing
- [ ] Availability check
- [ ] Booking form trigger

### Task 2.4: Booking Form (1.5 jam)
**🤖 Agent: frontend-developer + backend-developer**
- [ ] Date picker component - frontend
- [ ] Duration calculation - backend
- [ ] Price calculation - backend
- [ ] Booking confirmation dialog - frontend

---

## Hari 3 - Kamis, 10 Juli (User & Booking)
### 🎯 Agent: frontend-developer → backend-developer

### Task 3.1: User Dashboard (2 jam)
**🤖 Agent: frontend-developer**
- [ ] Dashboard layout dengan sidebar
- [ ] Stats cards (total booking, aktif, selesai)
- [ ] Profile page (`/dashboard/profile`)
- [ ] Edit profile functionality

### Task 3.2: User Bookings (CRUD Read, Update) (2 jam)
**🤖 Agent: frontend-developer + backend-developer**
- [ ] Bookings list page (`/dashboard/bookings`) - frontend
- [ ] BookingCard component - frontend
- [ ] Booking detail view - frontend
- [ ] Cancel booking (hanya status pending) - backend
- [ ] Status tracking - backend

### Task 3.3: Booking System (CRUD Create) (2 jam)
**🤖 Agent: backend-developer**
- [ ] Create booking ke Supabase
- [ ] Validasi ketersediaan
- [ ] Update stock kamera
- [ ] Booking confirmation page
- [ ] Integrasi loyalty card check (apakah user dapat diskon?)

### Task 3.4: Loyalty Card System (1.5 jam)
**🤖 Agent: backend-developer + database-administrator**
- [ ] Loyalty Card model & query di Supabase - database-admin
- [ ] Auto-create loyalty card saat booking pertama - backend
- [ ] Update count setiap booking selesai - backend
- [ ] Loyalty card component di dashboard - frontend
- [ ] Progress bar (0/5 → 5/5) - frontend
- [ ] Auto-apply diskon 15% saat count = 5 - backend
- [ ] Reset count setelah diskon dipakai - backend
- [ ] Riwayat penggunaan diskon - backend

### Task 3.5: Real-time Updates (0.5 jam)
**🤖 Agent: backend-developer**
- [ ] Realtime subscription untuk bookings
- [ ] Realtime update ketersediaan kamera

---

## Hari 4 - Jumat, 11 Juli (Admin, Payment & Polish)
### 🎯 Agent: frontend-developer → backend-developer → security-specialist

### Task 4.1: Admin Dashboard (1.5 jam)
**🤖 Agent: frontend-developer**
- [ ] Admin layout dengan sidebar
- [ ] Stats overview (total kamera, booking aktif, revenue)
- [ ] Recent bookings table

### Task 4.2: Admin - Camera Management (CRUD Full) (1.5 jam)
**🤖 Agent: frontend-developer + backend-developer**
- [ ] Camera list table - frontend
- [ ] Create camera form (dengan image upload) - frontend + backend
- [ ] Edit camera - frontend + backend
- [ ] Delete camera (dengan konfirmasi) - frontend + backend

### Task 4.3: Admin - Booking Management (CRUD Update) (1 jam)
**🤖 Agent: frontend-developer + backend-developer**
- [ ] Bookings list dengan filter status - frontend
- [ ] Update booking status - backend
- [ ] Detail booking view - frontend

### Task 4.4: Admin - Payment Management (0.5 jam)
**🤖 Agent: frontend-developer**
- [ ] Payment history list
- [ ] Filter by status

### Task 4.5: Admin - User Management (0.5 jam)
**🤖 Agent: frontend-developer**
- [ ] Users list
- [ ] User detail view

### Task 4.6: Midtrans Integration (2 jam)
**🤖 Agent: backend-developer + security-specialist**
- [ ] Install Midtrans SDK (`midtrans-client`) - backend
- [ ] Setup Midtrans Snap di `.env.local` - security
- [ ] API route `/api/payment` - create transaction - backend
- [ ] API route `/api/payment/webhook` - handle notification - backend
- [ ] Checkout page (`/checkout/[bookingId]`) - frontend
- [ ] Payment status page (`/payment/status`) - frontend
- [ ] Retry payment functionality - backend

### Task 4.7: Payment Flow Testing (1 jam)
**🤖 Agent: qa-tester**
- [ ] Test sandbox payment (BCA VA, Mandiri VA, QRIS)
- [ ] Test webhook callback
- [ ] Test booking status update setelah bayar

---

## Hari 5 - Sabtu, 12 Juli (Deploy & Final)
### 🎯 Agent: devops-engineer → qa-tester → refactor → technical-writer

### Task 5.1: AWS EC2 Setup (2 jam)
**🤖 Agent: devops-engineer**
- [ ] Launch EC2 instance (t3.small, Ubuntu)
- [ ] Install Node.js, npm
- [ ] Install & configure Nginx
- [ ] Setup SSL (Let's Encrypt)

### Task 5.2: Deployment (1.5 jam)
**🤖 Agent: devops-engineer**
- [ ] Push code ke GitHub
- [ ] Clone repo ke EC2
- [ ] Install dependencies
- [ ] Build Next.js app
- [ ] Setup PM2 untuk process manager
- [ ] Configure environment variables

### Task 5.3: Final Testing (1 jam)
**🤖 Agent: qa-tester**
- [ ] Test semua flow (register → browse → booking → bayar → admin)
- [ ] Fix bugs
- [ ] Responsive testing

### Task 5.4: Code Cleanup (30 menit)
**🤖 Agent: refactor**
- [ ] Run Biome format & lint
- [ ] Hapus unused code
- [ ] Optimize imports

### Task 5.5: Documentation (30 menit)
**🤖 Agent: technical-writer**
- [ ] Update README.md
- [ ] Screenshot untuk dokumentasi

---

## Agent Reference

| Agent | Fungsi | Contoh Prompt |
|-------|--------|---------------|
| **planner** | Planning & timeline | "Buat task breakdown untuk project Sewa Kamera" |
| **architect** | Arsitektur & flow | "Design flow booking dan payment untuk SaaS rental" |
| **ui-ux-designer** | Design UI/UX | "Buat hero section dengan Apple-inspired design" |
| **frontend-developer** | Build UI | "Buat CameraCard component dengan Framer Motion" |
| **backend-developer** | API & logic | "Buat API route untuk Midtrans payment" |
| **database-administrator** | DB schema | "Buat RLS policy untuk bookings table" |
| **qa-tester** | Testing | "Test flow booking dari awal sampai bayar" |
| **devops-engineer** | Deploy | "Setup EC2 dengan Nginx dan PM2" |
| **security-specialist** | Security | "Review RLS policies dan env vars" |
| **refactor** | Cleanup | "Optimize code dan hapus unused imports" |
| **technical-writer** | Dokumentasi | "Buat README dengan install commands" |
| **scrum-master** | Standup | "Daily standup: apa yang sudah selesai?" |
| **data-analyst** | Stats | "Buat query untuk revenue dashboard" |

---

## Summary Timeline

| Hari | Tanggal | Focus | Agent Utama | Estimasi Jam |
|------|---------|-------|-------------|--------------|
| 1 | 8 Juli | Foundation | planner, architect, database-admin, backend | 9 jam |
| 2 | 9 Juli | Core Features | ui-ux, frontend | 7.5 jam |
| 3 | 10 Juli | User & Booking | frontend, backend, database-admin | 8 jam |
| 4 | 11 Juli | Admin & Payment | frontend, backend, security, qa-tester | 8.5 jam |
| 5 | 12 Juli | Deploy & Final | devops, qa-tester, refactor, tech-writer | 5 jam |

**Total: ~38 jam kerja dalam 5 hari**

---

## Install Commands Reference

```bash
# ============================================
# INSTALL COMMANDS - Sewa Kamera Ryox
# Copy paste semua command ini ke terminal
# ============================================

# 1. Create project
npx create-next-app@latest sewa-kamera-ryox --typescript --tailwind --app --src-dir

# 2. Install semua dependencies
npm install @supabase/supabase-js @supabase/ssr midtrans-client framer-motion lucide-react date-fns clsx tailwind-merge

# 3. Install Biome.js (formatter + linter)
npm install -D @biomejs/biome
npx @biomejs/biome init

# 4. Setup shadcn/ui
npx shadcn@latest init

# 5. Format & Lint with Biome (setelah coding)
npx @biomejs/biome format --write .
npx @biomejs/biome lint --write .

# 6. Run development
npm run dev

# 7. Build untuk production
npm run build

# 8. Start production
npm run start
```

## Package.json (Reference)

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "midtrans-client": "^1.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

## Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Midtrans (Sandbox)
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=xxx
```

---

## Critical Path
1. Supabase setup → Auth → Layout → Pages
2. Database schema → Seed data → Catalog → Detail → Booking
3. Auth → Role check → Admin pages
4. Booking → Payment → Webhook → Status update
5. Code ready → EC2 setup → Deploy

## Risk Mitigation
| Risk | Mitigation |
|------|------------|
| Supabase delay | Fallback ke mock data sementara |
| EC2 issues | Pakai Vercel sebagai temporary deploy |
| Midtrans sandbox error | Test dengan card test dari Midtrans docs |
| Animasi kamera susah | Pakai GIF dari free resources atau CSS 3D transform |
| Fitur tidak selesai | Prioritaskan CRUD + Auth + Payment, fitur lain nice-to-have |
| Bug banyak | Test per-fitur sebelum lanjut |
