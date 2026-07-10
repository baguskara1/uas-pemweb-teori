# PRD - Sewa Kamera Ryox (Camera Rental SaaS)

## 1. Overview
Platform SaaS untuk penyewaan kamera yang memungkinkan pengguna menyewa kamera secara online. Platform ini menyediakan fitur CRUD lengkap, autentikasi, dan manajemen pemesanan dengan desain Apple-inspired minimalis.

## 2. Goals
- Menyediakan platform rental kamera yang mudah digunakan
- Mengimplementasikan fitur SaaS (multi-user, subscription-ready)
- Mengimplementasikan operasi CRUD pada semua entitas utama
- UI/UX Apple-inspired: clean, minimalis, premium feel

## 3. User Roles

| Role | Deskripsi |
|------|-----------|
| **Guest** | Pengunjung yang belum login, bisa melihat katalog |
| **User** | Pengguna terdaftar, bisa menyewa kamera |
| **Admin** | Mengelola kamera, pesanan, dan pengguna |

## 4. Fitur Utama

### 4.1 Authentication & Authorization
- [ ] Register & Login (Email + Password)
- [ ] Login dengan Google OAuth
- [ ] Reset Password
- [ ] Role-based access control (User/Admin)

### 4.2 Landing Page
- [ ] Hero section dengan animasi kamera 3D/GIF (kamera muter atau animasi menarik)
- [ ] Daftar kamera populer
- [ ] Fitur-fitur platform
- [ ] Testimoni
- [ ] CTA section
- [ ] Footer

### 4.3 Katalog Kamera (CRUD - Read)
- [ ] List semua kamera dengan filter & search
- [ ] Filter berdasarkan: brand, tipe, harga, ketersediaan
- [ ] Detail kamera (gambar, spesifikasi, harga/hari)
- [ ] Ketersediaan real-time

### 4.4 Sistem Pemesanan (CRUD - Create, Read, Update)
- [ ] Pilih tanggal sewa & durasi
- [ ] Keranjang sementara (sebelum checkout)
- [ ] Checkout & konfirmasi pesanan
- [ ] Status pesanan: Pending → Confirmed → On Progress → Returned → Completed
- [ ] Batalkan pesanan (hanya jika status Pending)

### 4.5 User Dashboard (CRUD - Read, Update)
- [ ] Profil pengguna
- [ ] Daftar pesanan saya
- [ ] Detail pesanan
- [ ] Riwayat sewa

### 4.6 Admin Dashboard (CRUD - Full)
- [ ] Kelola Kamera (Create, Read, Update, Delete)
- [ ] Kelola Pesanan (Update status)
- [ ] Kelola Pengguna (lihat data)
- [ ] Statistik dashboard (total kamera, pesanan aktif, pendapatan)

### 4.7 Storage
- [ ] Upload foto kamera (Supabase Storage)
- [ ] Avatar pengguna

### 4.8 Loyalty Card System (Gratis)
- [ ] Auto-generate loyalty card saat user pertama kali menyewa
- [ ] Progress bar: 0/5 → 1/5 → 2/5 → ... → 5/5
- [ ] Badge card di user dashboard
- [ ] Diskon 15% otomatis diterapkan pada penyewaan ke-5
- [ ] Setelah diskon dipakai, counter reset ke 0 (cycle baru)
- [ ] Riwayat penggunaan diskon

**Mekanisme:**
```
Sewa ke-1 → Loyalty Card diterbitkan (0/5)
Sewa ke-2 → Update progress (1/5)
Sewa ke-3 → Update progress (2/5)
Sewa ke-4 → Update progress (3/5)
Sewa ke-5 → Diskon 15% otomatis diterapkan → Reset ke 0/5
```

### 4.9 Payment System (Midtrans Sandbox)
- [ ] Integrasi Midtrans Snap (sandbox mode)
- [ ] Payment methods: VA (BCA, Mandiri, BNI), QRIS, E-Wallet (GoPay, ShopeePay)
- [ ] Checkout page dengan ringkasan order
- [ ] Redirect ke Midtrans payment page
- [ ] Webhook handler untuk update status pembayaran
- [ ] Payment status: pending, paid, failed, expired
- [ ] Retry payment jika gagal
- [ ] Invoice/receipt sederhana

**Flow Pembayaran:**
```
Booking Created → Checkout → Pilih Metode Bayar → Redirect Midtrans
    ↓
Pembayaran Berhasil → Webhook → Update Status → Booking Confirmed
    ↓
Pembayaran Gagal → Tampilkan Error → Retry Payment
```

## 5. Database Schema (Supabase PostgreSQL)

### Tables
```
profiles
  - id (uuid, FK → auth.users.id)
  - full_name (text)
  - email (text)
  - phone (text)
  - role (enum: 'user', 'admin')
  - avatar_url (text)
  - created_at (timestamp)

cameras
  - id (uuid)
  - name (text)
  - brand (text)
  - type (text) -- DSLR, Mirrorless, Action Cam, etc
  - description (text)
  - price_per_day (decimal)
  - image_url (text)
  - stock (integer)
  - is_available (boolean)
  - created_at (timestamp)

bookings
  - id (uuid)
  - user_id (uuid, FK → profiles.id)
  - camera_id (uuid, FK → cameras.id)
  - start_date (date)
  - end_date (date)
  - duration (integer) -- days
  - total_price (decimal)
  - discount_amount (decimal, default 0)
  - final_price (decimal)
  - status (enum: 'pending', 'confirmed', 'in_progress', 'returned', 'completed', 'cancelled')
  - notes (text)
  - created_at (timestamp)

loyalty_cards
  - id (uuid)
  - user_id (uuid, FK → profiles.id, unique)
  - current_count (integer, default 0) -- jumlah sewa saat ini
  - max_count (integer, default 5) -- target untuk diskon
  - discount_percent (integer, default 15) -- persentase diskon
  - is_active (boolean, default true)
  - created_at (timestamp)
  - updated_at (timestamp)

loyalty_history
  - id (uuid)
  - loyalty_card_id (uuid, FK → loyalty_cards.id)
  - booking_id (uuid, FK → bookings.id)
  - count_before (integer)
  - count_after (integer)
  - discount_applied (boolean)
  - discount_amount (decimal)
  - created_at (timestamp)

payments
  - id (uuid)
  - booking_id (uuid, FK → bookings.id)
  - user_id (uuid, FK → profiles.id)
  - amount (decimal)
  - method (text) -- va_bca, va_mandiri, va_bni, qris, gopay, shopeepay
  - midtrans_order_id (text)
  - midtrans_token (text)
  - status (enum: 'pending', 'paid', 'failed', 'expired')
  - paid_at (timestamp)
  - created_at (timestamp)
```

## 6. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui |
| Linting & Formatting | Biome.js |
| Backend | Supabase (Auth, Database, Storage, Realtime) |
| ORM | Supabase Client |
| Payment | Midtrans Snap (Sandbox) |
| Hosting | AWS EC2 |

## 7. Halaman & Route

```
/                      → Landing Page (dengan animasi kamera)
/cameras               → Katalog Kamera
/cameras/[id]          → Detail Kamera
/login                 → Login
/register              → Register
/dashboard             → User Dashboard
/dashboard/bookings    → Riwayat Sewa
/dashboard/loyalty     → Loyalty Card
/dashboard/profile     → Edit Profil
/checkout/[bookingId]  → Checkout & Pembayaran
/payment/status        → Status Pembayaran
/admin                 → Admin Dashboard
/admin/cameras         → Kelola Kamera
/admin/bookings        → Kelola Pesanan
/admin/payments        → Riwayat Pembayaran
/admin/users           → Kelola Pengguna
```

## 8. Design System (Apple-Inspired)

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Primary Action Blue** | `#0071E3` | CTA buttons, active states, links |
| **Primary Blue Hover** | `#006EDB` | Hover state |
| **Primary Blue Press** | `#0076DF` | Active/pressed state |
| **Text Dominant** | `#1D1D1F` | Primary text, headings |
| **Text Secondary** | `#333336` | Subheadings, supporting text |
| **Text Tertiary** | `#6E6E73` | Captions, timestamps |
| **Background** | `#FFFFFF` | Main background |
| **Surface Light** | `#EDEDF2` | Borders, dividers |
| **Navigation Surface** | `rgba(255, 255, 255, 0.8)` | Frosted glass navbar |
| **Overlay Soft** | `rgba(0, 0, 0, 0.8)` | Modal overlays |
| **Dark Surface** | `#272729` | Dark mode background |

### Typography

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Display Hero | SF Pro Display | 40px | 600 | 44px |
| Heading Large | SF Pro Display | 28px | 400 | 32px |
| Heading Primary | SF Pro Display | 24px | 600 | 28px |
| Body Default | SF Pro Text | 17px | 400 | 25px |
| Body Compact | SF Pro Text | 17px | 400 | 21px |
| Small Label | SF Pro Text | 12px | 400 | 16px |
| Button | SF Pro Text | 17px | 400 | 25px |
| Link | SF Pro Text | 17px | 600 | 21px |

### Component Styling

**Buttons:**
- Primary: `#0071E3` bg, `#FFFFFF` text, border-radius `50%`, min-height `44px`
- Secondary: transparent bg, `#0071E3` border, `#0071E3` text
- Ghost: transparent, no border

**Cards:**
- Border: `1px solid #EDEDF2`
- Border radius: `0px` (sharp corners)
- Padding: `24px - 32px`

**Navigation:**
- Frosted glass effect: `rgba(255, 255, 255, 0.8)` + `backdrop-blur`
- Height: `44px`

**Inputs:**
- Border radius: `8px`
- Height: `44px`
- Focus: `#0071E3` border + `box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1)`

### Spacing System
- Base unit: `4px`
- Cards padding: `24px - 32px`
- Sections: `40px - 56px` vertical margin
- Touch target: `44px` minimum

### Responsive Breakpoints
| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile | 320px - 767px | 1 column |
| Tablet | 768px - 1023px | 2 columns |
| Desktop | 1024px - 1440px | 3 columns |

## 9. Non-Functional Requirements
- Responsive design (mobile-first)
- Loading time < 3 detik
- HTTPS enabled
- Error handling yang proper
- Code formatting & linting dengan Biome.js

## 10. Out of Scope (v1)
- Rating & review
- Notifikasi email
- Push notification
- Payment gateway real (menggunakan Midtrans Sandbox untuk demo)
