# Supabase Setup - Sewa Kamera Ryox

## Status: Schema siap, butuh eksekusi manual ke Dashboard

File SQL sudah dibuat di `supabase/migrations/`. Karena saya tidak punya akses langsung ke akun Supabase Anda, langkah-langkah ini perlu Anda eksekusi via **Supabase Dashboard**.

## Langkah-Langkah

### 1. Buat Project Baru di Supabase
1. Buka https://supabase.com/dashboard
2. Klik **"New Project"**
3. Isi: Name, Database Password, Region (pilih Singapore untuk latency terbaik)
4. Tunggu provisioning selesai (~2 menit)

### 2. Jalankan Migration SQL (3 file, urut!)

Buka **SQL Editor** di sidebar Dashboard, lalu paste & run satu per satu:

**a) Schema (tables, enums, triggers):**
- File: `supabase/migrations/001_initial_schema.sql`
- Copy-paste isi file, klik **Run**

**b) RLS Policies:**
- File: `supabase/migrations/002_rls_policies.sql`
- Copy-paste isi file, klik **Run**

**c) Seed Data (10 kamera):**
- File: `supabase/migrations/003_seed_cameras.sql`
- Copy-paste isi file, klik **Run**

### 3. Setup Storage Bucket untuk Foto Kamera

1. Buka **Storage** di sidebar
2. Klik **"New bucket"**
3. Settings:
   - Name: `cameras`
   - Public bucket: **YES** (supaya foto bisa diakses tanpa auth)
4. Klik **"Create bucket"**

### 4. Promote User ke Admin (Untuk Testing)

Setelah Anda register user pertama nanti, jalankan SQL ini untuk menjadikan admin:

```sql
update profiles
set role = 'admin'
where email = 'email-anda@example.com';
```

### 5. Ambil API Credentials

1. Buka **Settings → API** di sidebar
2. Copy:
   - **Project URL** → paste ke `NEXT_PUBLIC_SUPABASE_URL` di `.env.local`
   - **anon public key** → paste ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`

### 6. Generate TypeScript Types

Setelah tables dibuat, generate types via Supabase CLI:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.ts
```

Atau gunakan cara manual via dashboard:
1. Buka **Settings → API → Generated Types**
2. Copy output ke `src/types/database.ts`

## File yang Sudah Dibuat

| File | Isi |
|------|-----|
| `supabase/migrations/001_initial_schema.sql` | 6 tables, 3 enums, 2 triggers |
| `supabase/migrations/002_rls_policies.sql` | RLS policies untuk semua tables |
| `supabase/migrations/003_seed_cameras.sql` | 10 kamera dummy (Sony, Canon, Nikon, Fujifilm, GoPro) |

## Tabel yang Dibuat

- `profiles` — user profiles (extends auth.users)
- `cameras` — katalog kamera
- `bookings` — pesanan sewa
- `loyalty_cards` — kartu loyalitas user
- `loyalty_history` — histori penggunaan loyalty
- `payments` — transaksi payment Midtrans

## Ringkasan RLS

- **Public read:** cameras (semua orang bisa lihat katalog)
- **Owner/admin:** profiles, bookings, payments
- **Admin only:** cameras CRUD, loyalty modifications
- **Auto-trigger:** profile dibuat otomatis saat user signup
