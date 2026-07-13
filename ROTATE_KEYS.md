# 🔑 Rotasi API Key — Step by Step

> ⏱ **Estimasi:** 15-20 menit  
> Lakukan **berurutan** dan test setiap langkah sebelum lanjut.

---

## 1. Supabase (anon key)

1. Buka https://supabase.com → **Project Settings** → **API**
2. Di bagian **Project API keys**, klik **Reveal** → **New anon key**
3. Salin key baru ke `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...key-baru
   ```
4. **Catatan:** URL project (`NEXT_PUBLIC_SUPABASE_URL`) tetap sama

---

## 2. Midtrans (Sandbox / Production)

1. Buka https://dashboard.midtrans.com → **Settings** → **Access Keys**
2. Klik **Generate New Key** (Client Key & Server Key)
3. Salin key baru ke `.env.local`:
   ```
   MIDTRANS_CLIENT_KEY=Mid-client-...baru
   MIDTRANS_SERVER_KEY=Mid-server-...baru
   ```
4. **Production:** ganti `MIDTRANS_IS_PRODUCTION=true`

---

## 3. OpenRouter

1. Buka https://openrouter.ai/keys
2. Klik **Create Key** → beri nama "sewa-kamera-ryox-prod"
3. Salin key baru ke `.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-...baru
   ```

---

## 4. Upstash Redis

1. Buka https://console.upstash.com/redis
2. Buat database baru (free tier cukup), atau buka existing
3. Copy **REST URL** dan **REST Token** ke `.env.local`:
   ```
   UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxx
   ```

---

## 5. Verifikasi

```bash
# Cek tidak ada secrets yang terlanjur ter-commit
git log --all --full-history --oneline -- .env.local
# → harusnya gak ada output

# Cek .env.local di-ignore
git check-ignore .env.local
# → harusnya output: .env.local

# Build & test
npm run build
npm run test

# Deploy ulang
```

---

## ⚠️ Catatan Penting

- **Jangan commit `.env.local`** — file ini sudah di `.gitignore` (`.env*`)
- Simpan `.env.local` di **luar folder project** (desktop / password manager)
- Di **server EC2**, set env vars via:
  ```bash
  sudo tee -a /etc/environment << 'EOF'
  OPENROUTER_API_KEY=xxx
  ...
  EOF
  ```
  atau via **PM2** ecosystem file
- **Hapus file `.env.local` dari lokal** setelah kamu simpan di tempat aman
