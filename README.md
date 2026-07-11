# Sewa Kamera Ryox

Platform rental kamera, lensa, aksesoris, tripod, dan gimbal profesional. Dibangun dengan Next.js 16, Supabase, dan Midtrans.

**🌐 Live Demo:** http://16.78.107.139

## Fitur

### Pengguna
- 🔍 **Katalog & Pencarian** — Jelajahi 31+ item (kamera, lensa, baterai, SD card, lighting, mic, tripod, gimbal) dengan filter brand, tipe, kategori, dan harga
- 🛒 **Multi-Item Cart** — Tambah beberapa item ke keranjang, atur jadwal sewa bersama, checkout sekali
- 💳 **Midtrans Payment** — Bayar via GoPay, QRIS, ShopeePay, Virtual Account (BCA/BNI/Mandiri)
- 🤖 **AI Assistant** — Asisten rekomendasi bertenaga Claude Sonnet 4.5 (via OpenRouter)
- 📊 **AI Budget Planner** — Racik paket sewa sesuai budget & durasi
- ❤️ **Wishlist** — Simpan item favorit
- 🎁 **Loyalty Card** — Diskon 15% otomatis setelah 5x booking
- 👤 **Dashboard** — Riwayat booking, profil, status pembayaran
- 🏠 **Landing Page** — Hero, AI Assistant, Budget Planner, Catalog, Testimonials, FAQ, CTA

### Admin
- 📷 **Manage Items** — CRUD kamera/aksesoris dengan upload gambar
- 📋 **Manage Bookings** — Lihat, filter, update status booking
- 💰 **Manage Payments** — Pantau transaksi
- 👥 **Manage Users** — Lihat detail pengguna

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Bahasa** | TypeScript, React 19 |
| **UI** | Tailwind CSS v4, Framer Motion, Lucide React |
| **Font** | Plus Jakarta Sans (display), Inter (text) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **Payment** | Midtrans Snap (sandbox) |
| **AI** | OpenRouter (`gryphe/mythomax-l2-13b`) |
| **Storage** | Supabase Storage (gambar produk) |
| **Linting** | Biome.js |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **Deploy** | AWS EC2 (t3.small, Ubuntu 24.04), Nginx, PM2 |

## Struktur Folder

```
src/
├── actions/          # Server actions (cameras, bookings)
├── app/
│   ├── admin/        # Admin dashboard + CRUD
│   ├── api/          # API routes (payments, wishlist, gemini)
│   ├── cameras/      # Katalog & detail
│   ├── cart/         # Cart page (legacy)
│   ├── checkout/     # Checkout single item
│   ├── dashboard/    # User dashboard
│   ├── login/        # Auth pages
│   ├── register/
│   └── (auth)/
├── components/
│   ├── admin/        # CameraForm, dll
│   ├── booking/      # BookingForm
│   ├── cameras/      # CameraCard, FilterSidebar, dll
│   ├── cart/         # CartModal
│   ├── dashboard/    # Sidebar, CancelBookingButton
│   ├── landing/      # Hero, AI, Catalog, WhyUs, Testimonials, FAQ, CTA
│   ├── layout/       # Navbar, Footer
│   └── shared/       # Toast, WishlistDrawer
├── contexts/         # AuthContext, CartContext
├── lib/
│   ├── supabase/     # Client & server Supabase helpers
│   ├── midtrans.ts   # Midtrans Snap integration
│   ├── gemini.ts     # AI client
│   ├── rate-limit.ts # In-memory rate limiter
│   ├── utils.ts      # formatCurrency
│   └── constants.ts  # Shared constants
└── types/            # Database types (generated)
```

## Instalasi Lokal

### Prasyarat
- Node.js ≥ 20.9
- npm
- Akun Supabase (gratis)
- Akun Midtrans (sandbox)

### Langkah

```bash
# Clone repository
git clone https://github.com/baguskara1/uas-pemweb-teori.git
cd uas-pemweb-teori

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Isi .env.local dengan kredensial Supabase, Midtrans, OpenRouter

# Setup database
# Jalankan migrasi di supabase/migrations/ via Supabase Dashboard atau CLI

# Build & run
npm run build
npm run start
```

### Development

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run lint     # Biome lint
npm run test     # Vitest unit tests
npm run test:e2e # Playwright E2E tests
```

## Environment Variables

| Variable | Keterangan |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key (sandbox) |
| `MIDTRANS_SERVER_KEY` | Midtrans server key (sandbox) |
| `MIDTRANS_IS_PRODUCTION` | `true` / `false` |
| `MIDTRANS_MERCHANT_ID` | Midtrans merchant ID |
| `OPENROUTER_API_KEY` | OpenRouter API key (untuk AI) |
| `NEXT_PUBLIC_APP_URL` | URL aplikasi (mis. `http://16.78.107.139`) |

## Database Migrations

Semua migrasi ada di `supabase/migrations/`:
- **001–007**: Setup awal (profiles, cameras, bookings, payments, storage, loyalty, wishlists, testimonials, FAQs)
- **008–010**: RPC functions, webhook, AI
- **011–013**: Lensa & aksesoris, category column
- **014–015**: Seed accessories, cart order_group

## Deployment (EC2)

```bash
# Setup (sekali)
ssh -i ~/Downloads/pemweb-teori.pem ubuntu@<IP>

# Install Node.js 22 + Nginx + PM2
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# Clone & build
git clone https://github.com/baguskara1/uas-pemweb-teori.git ~/app
cd ~/app
npm install
npm run build

# Start
pm2 start npm --name next-app -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Nginx (reverse proxy 80 → 3000)
sudo tee /etc/nginx/sites-available/next-app > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/next-app /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

## API Routes

| Route | Method | Auth | Keterangan |
|-------|--------|------|------------|
| `/api/payments/midtrans/submit` | POST | ✓ | Single item checkout |
| `/api/payments/midtrans/multi-submit` | POST | ✓ | Multi-item checkout |
| `/api/payments/midtrans/callback` | POST | Signature | Midtrans webhook |
| `/api/wishlist` | GET/POST/DELETE | ✓ | Wishlist CRUD |
| `/api/ai/gemini` | POST | ✓ | AI recommendation proxy |

Semua API routes memiliki **rate limiting** (20 req/60 detik per user).

## Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | (buat via register, update role di Supabase) | — |
| User | (register sendiri) | — |

**Catatan:** Admin role di-set via database langsung. Set `role = 'admin'` di tabel `profiles`.

## Design System

- **Primary:** `#0071E3` (Apple Blue)
- **Font:** Plus Jakarta Sans (heading), Inter (body)
- **Radius:** rounded-2xl / rounded-3xl (cards), rounded-full (buttons)
- **Shadow:** `shadow-[0_20px_40px_rgba(0,0,0,0.12)]`
- **Theme:** Light-only (no dark mode)
- **Bahasa:** Bahasa Indonesia

## Lisensi

Tugas Akhir — Universitas Amikom Yogyakarta.

© 2026 Rio Ardiyansyah. All rights reserved.
