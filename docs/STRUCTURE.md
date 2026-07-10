# Struktur Project - Sewa Kamera Ryox

**Note: Install commands harus dijalankan dari project root (bukan dari folder docs/)**

## Directory Structure

```
sewa-kamera-ryox/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-camera.png              ← Hero section (kamera produk)
│   │   ├── cameras/
│   │   │   ├── sony/                    ← Sony cameras
│   │   │   ├── canon/                   ← Canon cameras
│   │   │   ├── nikon/                   ← Nikon cameras
│   │   │   ├── fujifilm/                ← Fujifilm cameras
│   │   │   ├── gopro/                   ← Action cameras
│   │   │   └── video/                   ← Video cameras
│   │   ├── lenses/
│   │   │   ├── canon/                   ← Canon lenses
│   │   │   ├── nikon/                   ← Nikon lenses
│   │   │   └── sony/                    ← Sony lenses
│   │   ├── accessories/
│   │   │   ├── batteries/               ← Third party batteries
│   │   │   ├── support/                 ← Gimbal, tripod, slider
│   │   │   ├── audio/                   ← Clipon microphones
│   │   │   ├── lighting/                ← Softbox, ring light, reflector
│   │   │   └── memory/                  ← SD cards, microSD
│   │   └── icons/                       ← Brand icons
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (providers, navbar, footer)
│   │   ├── page.tsx                      # Landing page (dengan animasi kamera)
│   │   ├── globals.css                   # Global styles (Tailwind)
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login page
│   │   │   └── register/
│   │   │       └── page.tsx              # Register page
│   │   │
│   │   ├── cameras/
│   │   │   ├── page.tsx                  # Katalog kamera
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Detail kamera
│   │   │
│   │   ├── checkout/
│   │   │   └── [bookingId]/
│   │   │       └── page.tsx              # Checkout & pembayaran
│   │   │
│   │   ├── payment/
│   │   │   └── status/
│   │   │       └── page.tsx              # Status pembayaran
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Dashboard layout (sidebar)
│   │   │   ├── page.tsx                  # User dashboard home
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx              # Riwayat sewa
│   │   │   ├── loyalty/
│   │   │   │   └── page.tsx              # Loyalty card
│   │   │   └── profile/
│   │   │       └── page.tsx              # Edit profil
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx                # Admin layout (sidebar)
│   │       ├── page.tsx                  # Admin dashboard (stats)
│   │       ├── cameras/
│   │       │   └── page.tsx              # Kelola kamera
│   │       ├── bookings/
│   │       │   └── page.tsx              # Kelola pesanan
│   │       ├── payments/
│   │       │   └── page.tsx              # Riwayat pembayaran
│   │       └── users/
│   │           └── page.tsx              # Kelola pengguna
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Frosted glass navbar
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── cameras/
│   │   │   ├── CameraCard.tsx
│   │   │   ├── CameraGrid.tsx
│   │   │   ├── CameraFilter.tsx
│   │   │   ├── CameraForm.tsx           # Form create/edit (admin)
│   │   │   └── CameraDetail.tsx
│   │   │
│   │   ├── bookings/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingList.tsx
│   │   │   └── BookingStatusBadge.tsx
│   │   │
│   │   ├── loyalty/
│   │   │   ├── LoyaltyCard.tsx           # Card component
│   │   │   ├── LoyaltyProgress.tsx       # Progress bar
│   │   │   └── LoyaltyHistory.tsx        # Riwayat
│   │   │
│   │   ├── payment/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentStatus.tsx
│   │   │   └── InvoiceCard.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── RecentBookings.tsx
│   │   │   └── ProfileForm.tsx
│   │   │
│   │   └── landing/
│   │       ├── Hero.tsx                  # Dengan animasi kamera GIF
│   │       ├── Features.tsx
│   │       ├── PopularCameras.tsx
│   │       └── Testimonials.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser client
│   │   │   ├── server.ts                 # Server client (SSR)
│   │   │   └── middleware.ts             # Auth middleware
│   │   │
│   │   ├── midtrans/
│   │   │   └── snap.ts                   # Midtrans Snap client
│   │   │
│   │   ├── utils.ts                      # Helpers (formatCurrency, etc)
│   │   └── constants.ts                  # App constants
│   │
│   ├── types/
│   │   ├── database.ts                   # Generated types from Supabase
│   │   └── index.ts                      # Custom types
│   │
│   └── hooks/
│       ├── useAuth.ts
│       ├── useCameras.ts
│       ├── useBookings.ts
│       └── useLoyalty.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Database migration
│
├── .env.local                            # Environment variables
├── .env.example                          # Template env
├── biome.json                            # Biome.js config
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Key Dependencies

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

## Install Commands

```bash
# ============================================
# INSTALL COMMANDS - Sewa Kamera Ryox
# Pastikan kamu di folder: /Users/ryox/Documents/GitHub/uas-pemweb-teori/
# Copy paste semua command ini ke terminal
# ============================================

# 1. Create project (langsung di folder ini, buat subfolder baru)
npx create-next-app@latest . --typescript --tailwind --app --src-dir

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

## Biome.js Configuration (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "warn",
        "noUnusedVariables": "warn"
      },
      "style": {
        "noNonNullAssertion": "off"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

## Tailwind Config (Apple-Inspired)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0071E3',
          hover: '#006EDB',
          press: '#0076DF',
        },
        text: {
          dominant: '#1D1D1F',
          secondary: '#333336',
          tertiary: '#6E6E73',
        },
        surface: {
          light: '#EDEDF2',
          dark: '#272729',
          darker: '#18181A',
        },
      },
      fontFamily: {
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        text: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'input': '8px',
        'button': '50%',
      },
      minHeight: {
        'touch': '44px',
      },
      maxWidth: {
        'container': '1262px',
      },
    },
  },
  plugins: [],
}
export default config
```

## File Naming Convention
- Component: `PascalCase.tsx` (e.g., `CameraCard.tsx`)
- Utility/Function: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Page: `page.tsx` (Next.js App Router)
- Layout: `layout.tsx`
- Types: `camelCase.ts`

---

## Image Optimization

### Gunakan `next/image` (Built-in)

```tsx
import Image from "next/image"

// Cara pakai
<Image
  src="/images/cameras/sony/sony-a7-iv.jpg"
  alt="Sony A7 IV"
  width={800}
  height={600}
  quality={80}           // Kompresi (1-100, default 75)
  loading="lazy"         // Load saat scroll (hemat bandwidth)
  placeholder="blur"     // Efek blur saat loading
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Format Foto

| Format | Ukuran | Kualitas | Cocok untuk |
|--------|--------|----------|-------------|
| **WebP** | Kecil 25-35% | Sama bagusnya | Semua foto kamera |
| **AVIF** | Kecil 50% | Lebih bagus | Next.js support |
| **SVG** | Paling kecil | Vektor | Logo, icons saja |

### Tools Kompresi

| Tools | Link | Kegunaan |
|-------|------|----------|
| **TinyPNG** | tinypng.com | Kompres PNG/JPG manual |
| **Squoosh** | squoosh.app | Kompres + convert WebP |
| **Sharp** | npmjs.com/package/sharp | Kompresi via code |

### Best Practices

1. **Download dari Unsplash** → resolusi besar (1920x1080+)
2. **Kompres di Squoosh** → convert ke WebP, quality 80%
3. **Simpan ke project** → `public/images/`
4. **Pakai `next/image`** → otomatis optimize saat build

### Contoh Kompresi di Squoosh

1. Buka squoosh.app
2. Drag foto dari Unsplash
3. Pilih format **WebP**
4. Atur quality ke **80**
5. Download hasilnya
6. Simpan ke folder `public/images/`

### Sharp (Optional - Kompresi Otomatis)

```bash
npm install sharp
```

```javascript
// scripts/compress.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/original';
const outputDir = './public/images/optimized';

fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach(async (file) => {
  await sharp(path.join(inputDir, file))
    .resize(1200) // Max width 1200px
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, file.replace(/\.\w+$/, '.webp')));
});
```

### Ringkasan

| Langkah | Action |
|---------|--------|
| 1 | Download foto dari Unsplash (high-res) |
| 2 | Kompres di Squoosh → WebP, quality 80% |
| 3 | Simpan ke `public/images/` |
| 4 | Pakai `next/image` di code |
| 5 | Next.js otomatis optimize saat build |
