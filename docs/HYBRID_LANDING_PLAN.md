# Hybrid Landing Page + AI Gemini — Execution Plan

> **Project:** uas-pemweb-teori (Sewa Kamera Ryox)
> **Tujuan:** Rewrite landing page (opsi C — high risk high reward) + integrasi Asisten AI Gemini + Wishlist system
> **Scope:** Frontend only — database backend aman (zero changes)
> **Estimasi:** ~2.5 jam, 22 files, ~1500 baris

---

## 📋 Keputusan Final

| # | Keputusan | Detail |
|---|---|---|
| 1 | Opsi C | Full rewrite landing page, high risk high reward |
| 2 | Gemini API key | Belum ada — guide step-by-step di Phase 0 |
| 3 | Data kamera | **Supabase real data** (live inventory), bukan hardcode mock |
| 4 | Wishlist | **Persistent ke user** — pakai table baru `wishlists` di Supabase |
| 5 | Color scheme | **Apple blue** `#0071E3` (match token project) — hapus amber/gold |
| 6 | Dark mode | **Skip dulu** — light-only, hemat scope |
| 7 | File structure | Split modular jadi ~15 files |

---

## 🗄️ Database Schema (3 Tables Baru)

### `wishlists`
```sql
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  camera_id uuid not null references cameras(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, camera_id)
);

alter table wishlists enable row level security;

create policy "Users can read own wishlist"
  on wishlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist"
  on wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on wishlists for delete
  using (auth.uid() = user_id);
```

### `testimonials`
```sql
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  avatar_url text,
  comment text not null,
  rating int not null default 5,
  project text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "Anyone can read testimonials"
  on testimonials for select
  using (is_visible = true);
```

### `faqs`
```sql
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table faqs enable row level security;

create policy "Anyone can read faqs"
  on faqs for select
  using (is_visible = true);
```

---

## 🏗️ Arsitektur File (22 Files)

### Phase 0: Setup (1 file)
```
.env.local                          # + GEMINI_API_KEY
```

### Phase 1: Database (3 migration files)
```
supabase/migrations/XXXX_wishlists.sql
supabase/migrations/XXXX_testimonials.sql
supabase/migrations/XXXX_faqs.sql
```

### Phase 2: API Routes (2 files)
```
src/app/api/ai/gemini/route.ts      # Server-side Gemini proxy (POST)
src/app/api/wishlist/route.ts        # Wishlist CRUD (GET/POST/DELETE)
```

### Phase 3: Library Helpers (2 files)
```
src/lib/gemini.ts                    # Client wrapper → /api/ai/gemini
src/lib/wishlist.ts                  # Client helpers → /api/wishlist
```

### Phase 4: Shared Components (2 files)
```
src/components/shared/Toast.tsx           # Toast notification provider
src/components/shared/WishlistDrawer.tsx   # Slide-in wishlist panel
```

### Phase 5: Landing Sections (9 files)
```
src/components/landing/HeroSearch.tsx           # Hero + inline search bar + stats
src/components/landing/AIAssistant.tsx          # AI Production Assistant (Gemini)
src/components/landing/AIBudgetPlanner.tsx      # AI Budget Pack Planner (Gemini)
src/components/landing/CatalogSection.tsx       # Filter + grid + pagination + wishlist (Supabase)
src/components/landing/CameraDetailModal.tsx    # Detail modal (specs/calendar/loyalty/AI)
src/components/landing/WhyUs.tsx               # 3 value cards
src/components/landing/TestimonialsCarousel.tsx # Carousel dari Supabase
src/components/landing/FAQAccordion.tsx        # Accordion dari Supabase
src/components/landing/FinalCTA.tsx            # CTA section
```

### Phase 6: Wire Up (3 files — updated)
```
src/app/layout.tsx                  # + ToastProvider
src/components/layout/Navbar.tsx    # + Wishlist button
src/app/page.tsx                    # Rewrite — orchestrate all sections
```

---

## 📊 Per-File Breakdown + Code Snippet

### Phase 0: Setup

#### 1. `.env.local`
```
GEMINI_API_KEY=AIzaSyAb8RN6IJC2M33JbP-iqkKI7FDpvDsA_XuR_H0noReJC4HhrbDA
```

---

### Phase 1: Database Migrations

#### 2. `supabase/migrations/XXXX_wishlists.sql`
```sql
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  camera_id uuid not null references cameras(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, camera_id)
);

alter table wishlists enable row level security;

create policy "Users can read own wishlist"
  on wishlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own wishlist"
  on wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on wishlists for delete
  using (auth.uid() = user_id);
```

#### 3. `supabase/migrations/XXXX_testimonials.sql`
```sql
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  avatar_url text,
  comment text not null,
  rating int not null default 5,
  project text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "Anyone can read testimonials"
  on testimonials for select
  using (is_visible = true);
```

#### 4. `supabase/migrations/XXXX_faqs.sql`
```sql
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table faqs enable row level security;

create policy "Anyone can read faqs"
  on faqs for select
  using (is_visible = true);
```

---

### Phase 2: API Routes

#### 5. `src/app/api/ai/gemini/route.ts`
```typescript
// Server-side Gemini proxy — NEVER expose API key to client
// POST /api/ai/gemini
// Body: { prompt: string, systemPrompt?: string }

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_RETRIES = 4;

async function fetchGemini(prompt: string, systemPrompt?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');
      return text;
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, systemPrompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const result = await fetchGemini(prompt, systemPrompt);
    return Response.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
```

#### 6. `src/app/api/wishlist/route.ts`
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('wishlists')
    .select('id, camera_id, created_at, camera:cameras(name, brand, image_url, price_per_day)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { cameraId } = await request.json();
  if (!cameraId) return Response.json({ error: 'cameraId required' }, { status: 400 });

  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, camera_id: cameraId })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const cameraId = request.nextUrl.searchParams.get('cameraId');
  if (!cameraId) return Response.json({ error: 'cameraId required' }, { status: 400 });

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('camera_id', cameraId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
```

---

### Phase 3: Library Helpers

#### 7. `src/lib/gemini.ts`
```typescript
export async function callGeminiAI(prompt: string, systemPrompt?: string) {
  const res = await fetch('/api/ai/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get AI response');
  return data.result as string;
}
```

#### 8. `src/lib/wishlist.ts`
```typescript
export async function getWishlist() {
  const res = await fetch('/api/wishlist');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.data ?? [];
}

export async function addToWishlist(cameraId: string) {
  const res = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cameraId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.data;
}

export async function removeFromWishlist(cameraId: string) {
  const res = await fetch(`/api/wishlist?cameraId=${cameraId}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.success;
}
```

---

### Phase 4: Shared Components

#### 9. `src/components/shared/Toast.tsx`
```tsx
'use client';
import { Sparkle, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'info' | 'error';
type ToastContext = { show: (message: string, type?: ToastType) => void };

const ToastCtx = createContext<ToastContext>({ show: () => {} });
export const useToast = () => useContext(ToastCtx);

type ToastState = { show: boolean; message: string; type: ToastType };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const show = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(s => ({ ...s, show: false })), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold ${
            toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400'
            : toast.type === 'info' ? 'bg-zinc-900 text-white border-zinc-700'
            : 'bg-red-500 text-white border-red-400'
          }`}>
            <Sparkle className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toast.message}</span>
            <button onClick={() => setToast(s => ({ ...s, show: false }))} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}
```

#### 10. `src/components/shared/WishlistDrawer.tsx`
```tsx
'use client';
import { Heart, X, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '@/lib/wishlist';
import { useToast } from './Toast';

type WishlistItem = {
  id: string;
  camera_id: string;
  created_at: string;
  camera?: { name: string; brand: string; image_url: string | null; price_per_day: number };
};

export function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getWishlist().then(data => { setItems(data); setLoading(false); });
    }
  }, [open, user]);

  const handleRemove = async (cameraId: string) => {
    await removeFromWishlist(cameraId);
    setItems(items.filter(i => i.camera_id !== cameraId));
    show('Dihapus dari Wishlist', 'info');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h3 className="font-display text-lg font-semibold">Wishlist Saya</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-dark text-text-tertiary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-text-tertiary">Memuat...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Heart className="w-12 h-12 text-black/20 mx-auto" />
                <p className="text-text-tertiary">Wishlist Anda kosong.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-surface-dark border border-black/10">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-light">
                      {item.camera?.image_url ? (
                        <img src={item.camera.image_url} alt={item.camera.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center"><Camera className="w-6 h-6 text-text-tertiary" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-tertiary uppercase tracking-wider">{item.camera?.brand}</p>
                      <h4 className="font-display text-sm font-semibold truncate">{item.camera?.name}</h4>
                      <p className="text-xs text-primary font-semibold mt-1">
                        Rp {(item.camera?.price_per_day ?? 0).toLocaleString('id-ID')} / hari
                      </p>
                    </div>
                    <button onClick={() => handleRemove(item.camera_id)} className="text-text-tertiary hover:text-red-500 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

---

### Phase 5: Landing Sections

#### 11. `src/components/landing/HeroSearch.tsx`
```tsx
'use client';
import { Camera, Search, Sparkles } from 'lucide-react';

type HeroSearchProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearch: () => void;
};

export function HeroSearch({ searchQuery, onSearchChange, onSearch }: HeroSearchProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Kini Dilengkapi Asisten Produksi AI Gemini 2.5</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-[-0.04em] leading-none">
              Sewa Kamera Instan{' '}
              <span className="text-primary">Untuk Hasil Sinematik</span>
            </h1>

            <p className="text-base sm:text-lg text-black/60 max-w-xl mx-auto lg:mx-0">
              Sewa perangkat kamera profesional secara online. Tanpa proses berbelit-belit, jaminan alat steril, dan stok terjamin.
            </p>

            {/* Hero Search Bar */}
            <div className="max-w-md mx-auto lg:mx-0 pt-2">
              <div className="p-1.5 rounded-2xl flex items-center gap-2 border border-black/10 bg-white shadow-lg focus-within:ring-2 focus-within:ring-primary/40">
                <div className="pl-3 text-text-tertiary">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari kamera Sony, Canon, Lensa..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                  className="bg-transparent border-0 outline-none w-full text-sm py-2"
                />
                <button
                  onClick={onSearch}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-text font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Temukan
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-display font-semibold text-primary">100%</div>
                <div className="text-xs text-text-tertiary font-medium">Alat Terawat</div>
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary">48 Jam</div>
                <div className="text-xs text-text-tertiary font-medium">Batal Gratis</div>
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary">15% Off</div>
                <div className="text-xs text-text-tertiary font-medium">Sewa Kelima</div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-6 md:p-8 border border-black/10 bg-white shadow-2xl">
              <div className="rounded-2xl aspect-[4/3] bg-surface-dark mb-4 flex items-center justify-center">
                <Camera className="w-20 h-20 text-primary/40" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-tertiary">Mulai dari</span>
                  <span className="font-display text-lg font-semibold text-primary">
                    Rp 350.000 <span className="text-xs font-normal text-text-tertiary">/ hari</span>
                  </span>
                </div>
                <button className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-text font-semibold transition-all">
                  Jelajahi Katalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### 12. `src/components/landing/AIAssistant.tsx`
```tsx
'use client';
import { Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { callGeminiAI } from '@/lib/gemini';
import { useToast } from '@/components/shared/Toast';

const SYSTEM_PROMPT = `Anda adalah asisten AI ahli peralatan kamera dan videografi dari Sewa Kamera Ryox.
Tugas Anda adalah memformulasikan rekomendasi alat terbaik dari katalog kami.
Format respon dengan bahasa Indonesia yang profesional, berikan tips pengaturan teknis (ISO, aperture, fps, color profile) yang spesifik.
Gunakan bullet points. Respon harus premium dan informatif.`;

export function AIAssistant() {
  const { show } = useToast();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickScenarios = [
    'Cinematic Pre-Wedding',
    'Vlog Malam Ekstrem',
    'Konser Musik Redup',
    'Wawancara Studio',
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await callGeminiAI(input, SYSTEM_PROMPT);
      setResponse(result);
      show('Rekomendasi AI berhasil disusun!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses permintaan';
      setError(msg);
      show('Gagal memuat rekomendasi AI', 'error');
    } finally {
      setLoading(false);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 border-t border-black/10 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bertenaga Gemini 2.5 Flash</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Asisten Produksi Film Pintar
          </h2>
          <p className="text-black/60 text-sm">
            Jelaskan ide syuting atau konsep kreatif Anda. Biarkan AI merancang rekomendasi paket sewa dan panduan teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl border border-black/10 bg-white shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block">
                  Jelaskan Konsep Syuting Anda:
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Contoh: Saya mau syuting cinematic vlog perjalanan naik gunung di malam hari dengan cahaya minim..."
                  rows={4}
                  className="w-full p-4 rounded-2xl text-sm border border-black/15 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block w-full mb-1">
                  Pilih Cepat Skenario:
                </span>
                {quickScenarios.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setInput(`Saya merencanakan syuting proyek: ${sug}. Rekomendasikan set kamera terbaik beserta setelan ISO, aperture, fps, dan color profile yang pas.`)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-surface-dark text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-press text-white font-text font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sedang Merancang...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Konsultasikan Dengan AI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Area */}
          <div className="lg:col-span-7">
            {response ? (
              <div className="p-6 md:p-8 rounded-3xl border border-black/10 bg-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Hasil Rekomendasi AI Gemini</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Aktif</span>
                </div>
                <div className="p-5 rounded-2xl bg-surface-dark text-sm leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                  {response}
                </div>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>Setiap paket bisa disewa langsung di katalog.</span>
                  <button onClick={scrollToCatalog} className="text-primary font-semibold hover:underline flex items-center gap-1">
                    Buka Katalog <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed border-black/10 bg-surface-dark text-center space-y-4">
                <Sparkles className="w-12 h-12 text-black/20 mx-auto" />
                <p className="text-sm text-text-tertiary max-w-md mx-auto">
                  Ketik konsep produksi Anda di kolom kiri, lalu asisten AI akan menyusun detail rekomendasi gear dan tips setting di sini.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Gagal Menghubungi Asisten AI</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### 13. `src/components/landing/AIBudgetPlanner.tsx`
```tsx
'use client';
import { Coins, AlertTriangle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { callGeminiAI } from '@/lib/gemini';
import { useToast } from '@/components/shared/Toast';

export function AIBudgetPlanner() {
  const { show } = useToast();
  const [budgetLimit, setBudgetLimit] = useState(1000000);
  const [duration, setDuration] = useState(3);
  const [projectType, setProjectType] = useState('Cinematic Short Film');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setPlan('');

    // Fetch real cameras from Supabase for context
    const { data: cameras } = await createClient()
      .from('cameras')
      .select('id, name, brand, type, price_per_day')
      .eq('is_available', true);

    const inventoryContext = JSON.stringify(cameras ?? []);

    try {
      const result = await callGeminiAI(
        `Saya punya total budget maksimal Rp ${budgetLimit.toLocaleString('id-ID')} untuk proyek sewa kamera selama ${duration} hari. Jenis proyek: "${projectType}".
Katalog inventaris: ${inventoryContext}.
Pilihkan kombinasi sewa paling optimal. Berikan rincian harga harian & kalkulasi total. Pastikan total TIDAK MELEBIHI budget.`,
        'Anda adalah AI Budget Planner cerdas. Racik kombinasi sewa paling optimal, fungsional, dan pastikan total biaya di bawah budget. Bahasa Indonesia.'
      );
      setPlan(result);
      show('Rencana Budget berhasil dibuat!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal meracik budget';
      setError(msg);
      show('Gagal meracik budget', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 border-t border-black/10 bg-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
            <Coins className="w-3.5 h-3.5" />
            <span>Optimasi Anggaran Kreatif</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
            Sewa Pintar Sesuai Budget
          </h2>
          <p className="text-zinc-400 text-sm">
            Sebutkan budget maksimal dan lama pemakaian. AI akan memilih kamera, lensa, dan aksesoris optimal dari inventaris riil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Input Panel */}
          <div className="lg:col-span-5 bg-zinc-800 border border-zinc-700 p-6 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Budget Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <span>Maksimal Budget</span>
                  <span className="text-primary font-semibold">Rp {budgetLimit.toLocaleString('id-ID')}</span>
                </div>
                <input
                  type="range"
                  min={400000}
                  max={5000000}
                  step={100000}
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-1.5 bg-zinc-700 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Rp 400.000</span>
                  <span>Rp 5.000.000</span>
                </div>
              </div>

              {/* Duration Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">Durasi Sewa (Hari):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all border ${
                        duration === d ? 'bg-primary text-white border-primary' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {d} Hari
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">Tipe Proyek:</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Cinematic Short Film">Film Pendek Sinematik</option>
                  <option value="Wedding / Pre-Wedding">Pernikahan / Pre-Wedding</option>
                  <option value="Extreme Travel Vlog">Vlog Wisata Ekstrem</option>
                  <option value="Music Video">Video Musik (Klip)</option>
                  <option value="Product Photography">Foto Produk</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-text font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengkalkulasi...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 animate-pulse" />
                  Racik Paket Budget
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 bg-zinc-800 border border-zinc-700 p-6 rounded-3xl flex flex-col justify-between">
            {plan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-700 pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Hasil Optimasi Rencana AI</span>
                  </div>
                  <span className="text-xs text-zinc-400">{duration} Hari Sewa</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {plan}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 text-zinc-500">
                <Coins className="w-16 h-16 text-zinc-700 mx-auto" />
                <p className="text-sm max-w-sm text-zinc-400">
                  Tentukan budget maksimal Anda menggunakan slider, pilih proyek, lalu tekan tombol &ldquo;Racik Paket Budget&rdquo;.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Gagal Meracik Budget</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### 14. `src/components/landing/CatalogSection.tsx`
```tsx
'use client';
import { useMemo, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronDown, Camera, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/shared/Toast';
import { addToWishlist, removeFromWishlist } from '@/lib/wishlist';
import { CameraDetailModal } from './CameraDetailModal';

type CameraRow = {
  id: string; name: string; brand: string; type: string;
  price_per_day: number; image_url: string | null; is_available: boolean; stock: number;
};

type CatalogSectionProps = {
  initialCameras: CameraRow[];
  brands: string[];
  types: string[];
};

export function CatalogSection({ initialCameras, brands, types }: CatalogSectionProps) {
  const { user } = useAuth();
  const { show } = useToast();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(2000000);
  const [page, setPage] = useState(1);
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraRow | null>(null);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (user) {
      fetch('/api/wishlist').then(r => r.json()).then(d => {
        if (d.data) setWishlisted(d.data.map((i: { camera_id: string }) => i.camera_id));
      });
    }
  }, [user]);

  const filtered = useMemo(() => {
    let list = [...initialCameras];
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()));
    if (selectedBrand !== 'All') list = list.filter(c => c.brand === selectedBrand);
    if (selectedCategory !== 'All') list = list.filter(c => c.type === selectedCategory);
    list = list.filter(c => c.price_per_day <= priceRange);
    if (sortBy === 'popular') list.sort((a, b) => b.stock - a.stock);
    else if (sortBy === 'price-low') list.sort((a, b) => a.price_per_day - b.price_per_day);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price_per_day - a.price_per_day);
    return list;
  }, [initialCameras, search, selectedBrand, selectedCategory, sortBy, priceRange]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleWishlist = async (cameraId: string) => {
    if (!user) { show('Login dulu untuk wishlist', 'info'); return; }
    if (wishlisted.includes(cameraId)) {
      await removeFromWishlist(cameraId);
      setWishlisted(w => w.filter(id => id !== cameraId));
      show('Dihapus dari Wishlist', 'info');
    } else {
      await addToWishlist(cameraId);
      setWishlisted(w => [...w, cameraId]);
      show('Ditambahkan ke Wishlist', 'success');
    }
  };

  const resetFilters = () => {
    setSearch(''); setSelectedBrand('All'); setSelectedCategory('All');
    setSortBy('popular'); setPriceRange(2000000); setPage(1);
  };

  return (
    <section id="catalog-section" className="py-20 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">Katalog Kamera & Aksesoris</h2>
          <p className="text-black/60 text-sm">Gunakan filter untuk menyaring kamera terbaik sesuai kebutuhan Anda.</p>
        </div>

        {/* Filter Panel */}
        <div className="p-6 rounded-3xl border border-black/10 bg-white mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari berdasarkan tipe, spesifikasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            {/* Brand Filter */}
            <div className="md:col-span-3 relative">
              <select value={selectedBrand} onChange={e => { setSelectedBrand(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary outline-none appearance-none">
                <option value="All">Semua Merek</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            </div>
            {/* Sort */}
            <div className="md:col-span-4 relative">
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-black/15 bg-white focus:border-primary outline-none appearance-none">
                <option value="popular">Tingkat Kepopuleran</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mr-2">Kategori:</span>
            {['All', ...types].map(cat => (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat ? 'bg-primary text-white shadow' : 'bg-surface-dark text-text-tertiary hover:text-primary hover:bg-primary/10'
                }`}>
                {cat === 'All' ? 'Semua' : cat}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-text-tertiary">Harga Harian Maksimal</span>
                <span className="text-primary">Rp {priceRange.toLocaleString('id-ID')}</span>
              </div>
              <input type="range" min={200000} max={2000000} step={50000} value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-surface-dark rounded-lg appearance-none" />
            </div>
            <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-600 font-semibold self-end sm:self-auto transition-colors">
              Reset Semua Filter
            </button>
          </div>
        </div>

        {/* Camera Grid */}
        {paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(camera => (
                <div key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className="group rounded-2xl border border-black/10 bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-black/20">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-surface-dark overflow-hidden">
                    {camera.image_url ? (
                      <img src={camera.image_url} alt={camera.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="grid h-full place-items-center"><Camera className="w-12 h-12 text-primary/40" /></div>
                    )}
                    <span className="absolute top-3 left-3 bg-black/80 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase">
                      {camera.brand}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleWishlist(camera.id); }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm shadow transition-all ${
                        wishlisted.includes(camera.id) ? 'bg-red-500 text-white' : 'bg-black/50 hover:bg-black/80 text-white'
                      }`}>
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-semibold">{camera.type}</span>
                      <h3 className="font-display text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">{camera.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      <div>
                        <p className="font-text font-semibold text-primary">
                          {formatCurrency(camera.price_per_day)}
                          <span className="text-xs font-normal text-text-tertiary"> / hari</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {camera.is_available ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12">
                {page > 1 && (
                  <button onClick={() => setPage(p => p - 1)}
                    className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-text-tertiary hover:border-primary hover:text-primary transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`grid place-items-center h-touch w-10 rounded-full font-text text-sm transition-colors ${
                      page === i + 1 ? 'bg-primary text-white font-semibold' : 'border border-black/10 text-text-tertiary hover:border-primary hover:text-primary'
                    }`}>
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button onClick={() => setPage(p => p + 1)}
                    className="grid place-items-center h-touch w-10 border border-black/10 rounded-full text-text-tertiary hover:border-primary hover:text-primary transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="p-16 rounded-3xl text-center border border-dashed border-black/10 bg-surface-dark space-y-6">
            <Camera className="w-12 h-12 text-black/20 mx-auto" />
            <h3 className="font-display text-xl font-semibold">Kamera Tidak Ditemukan</h3>
            <p className="text-sm text-text-tertiary max-w-md mx-auto">Coba kurangi filter atau cari kata kunci lain.</p>
            <button onClick={resetFilters} className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-text font-semibold text-xs uppercase tracking-wider transition-all">
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Camera Detail Modal */}
      {selectedCamera && <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} />}
    </section>
  );
}
```

#### 15. `src/components/landing/CameraDetailModal.tsx`
```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { X, Star, ShoppingBag, Camera, CheckCircle2, Loader2, Sparkles, Award, Calendar } from 'lucide-react';
import { callGeminiAI } from '@/lib/gemini';
import { useToast } from '@/components/shared/Toast';

type Camera = {
  id: string; name: string; brand: string; type: string;
  price_per_day: number; image_url: string | null;
  is_available: boolean; stock: number;
  description?: string | null;
};

export function CameraDetailModal({ camera, onClose }: { camera: Camera; onClose: () => void }) {
  const router = useRouter();
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<'specs' | 'calendar' | 'loyalty' | 'ai'>('specs');
  const [rentalDays, setRentalDays] = useState(1);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const totalPrice = camera.price_per_day * rentalDays;
  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  const handleSewa = () => {
    onClose();
    router.push(`/cameras/${camera.id}`);
  };

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await callGeminiAI(
        aiQuery,
        `Kamera: ${camera.name} (${camera.brand}, ${camera.type}). Harga: Rp ${camera.price_per_day}/hari. Jawab dengan tips operasional mendalam. Bahasa Indonesia.`
      );
      setAiResponse(res);
      show('Analisis AI siap!', 'success');
    } catch {
      setAiResponse('Maaf, gagal mendapat jawaban. Coba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 bg-white shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 z-10 p-2 rounded-full bg-surface-dark hover:bg-primary hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
          {/* Left Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-surface-dark">
              {camera.image_url ? (
                <img src={camera.image_url} alt={camera.name} className="w-full h-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center"><Camera className="w-16 h-16 text-primary/40" /></div>
              )}
            </div>
            <div className="p-4 rounded-xl bg-surface-dark border border-black/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Ketersediaan</span>
              </div>
              <p className="text-xs text-text-tertiary">
                {camera.is_available ? `Ada ${camera.stock} unit siap disewa` : 'Sedang tidak tersedia'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{camera.brand} · {camera.type}</p>
              <h3 className="font-display text-2xl font-semibold mt-1">{camera.name}</h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-black/10">
              {(['specs', 'calendar', 'loyalty', 'ai'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-dominant'
                  }`}>
                  {tab === 'specs' ? 'Spesifikasi' : tab === 'calendar' ? 'Kalender' : tab === 'loyalty' ? 'Diskon' : '✨ Tanya AI'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[160px]">
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">{camera.description || 'Belum ada deskripsi untuk kamera ini.'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface-dark">
                      <p className="text-[10px] text-text-tertiary uppercase font-semibold">Tipe</p>
                      <p className="text-xs font-semibold mt-1">{camera.type}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-dark">
                      <p className="text-[10px] text-text-tertiary uppercase font-semibold">Merek</p>
                      <p className="text-xs font-semibold mt-1">{camera.brand}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button disabled={rentalDays <= 1} onClick={() => setRentalDays(d => d - 1)}
                      className="px-4 py-2 rounded-xl bg-surface-dark font-semibold disabled:opacity-40">&minus;</button>
                    <span className="font-display text-lg font-semibold">{rentalDays} Hari</span>
                    <button onClick={() => setRentalDays(d => d + 1)}
                      className="px-4 py-2 rounded-xl bg-surface-dark font-semibold">+</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center max-w-[280px]">
                    {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
                      <span key={i} className="text-[10px] font-semibold text-text-tertiary py-1">{d}</span>
                    ))}
                    {Array.from({ length: 14 }).map((_, i) => {
                      const booked = i + 10 === 12 || i + 10 === 13;
                      return (
                        <button key={i} disabled={booked}
                          className={`py-1.5 rounded text-xs font-semibold ${booked ? 'bg-red-100 text-red-300 line-through cursor-not-allowed' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                          {i + 10}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'loyalty' && (
                <div className="p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-sm font-semibold">Kartu Loyalitas Digital</h4>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Sewa sebanyak 4 kali, dapatkan diskon otomatis <span className="font-semibold text-primary">15% pada sewa ke-5</span> Anda!
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <div key={s} className={`flex-1 h-10 rounded-lg flex items-center justify-center border font-semibold text-xs ${
                        s === 5 ? 'bg-primary text-white border-primary' : 'bg-surface-dark border-black/10 text-text-tertiary'
                      }`}>{s === 5 ? '15%' : s}</div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex gap-2">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-primary">AI Genius Bar</h4>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        Konsultasikan setting terbaik untuk {camera.name} sesuai kebutuhan proyek Anda.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAiAsk()}
                      placeholder={`Tanya tentang ${camera.name}...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-primary" />
                    <button onClick={handleAiAsk} disabled={aiLoading || !aiQuery.trim()}
                      className="px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-text text-xs font-semibold transition-all disabled:opacity-50">
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim'}
                    </button>
                  </div>
                  {aiResponse && (
                    <div className="p-4 rounded-xl bg-surface-dark text-sm leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total + CTA */}
            <div className="p-4 rounded-2xl border border-black/10 bg-surface-dark">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-text-tertiary block font-semibold">Estimasi Total ({rentalDays} Hari)</span>
                  <span className="font-display text-xl font-semibold text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <button onClick={handleSewa}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-text font-semibold transition-all flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Sewa Kamera Ini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 16. `src/components/landing/WhyUs.tsx`
```tsx
import { ShieldCheck, Award, Clock } from 'lucide-react';

const values = [
  { icon: ShieldCheck, title: 'Kamera & Lensa Steril', desc: 'Setiap kamera dibersihkan melalui ruang sterilisasi UV-C untuk kebersihan maksimal.' },
  { icon: Award, title: 'Loyalty Stamp 15%', desc: 'Sistem retensi pelanggan memberikan diskon 15% otomatis pada penyewaan ke-5 Anda.' },
  { icon: Clock, title: 'Konfirmasi Instan', desc: 'Sistem ketersediaan stok real-time menghilangkan risiko pemesanan ganda.' },
];

export function WhyUs() {
  return (
    <section className="py-20 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">Mengapa Sewa Kamera Ryox?</h2>
          <p className="text-black/60 text-sm">Layanan didesain untuk memenuhi standar ketat fotografer profesional dan pembuat film independen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(v => (
            <div key={v.title} className="p-8 rounded-3xl border border-black/10 bg-white text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="text-sm text-black/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 17. `src/components/landing/TestimonialsCarousel.tsx`
```tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star } from 'lucide-react';

type Testimonial = {
  id: string; name: string; role: string; avatar_url: string | null;
  comment: string; rating: number; project: string | null;
};

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    createClient().from('testimonials').select('*').eq('is_visible', true).then(({ data }) => {
      if (data) setTestimonials(data);
    });
  }, []);

  if (testimonials.length === 0) return null;

  const t = testimonials[index];
  return (
    <section className="py-20 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">Komentar Para Penyewa</h2>
          <p className="text-black/60 text-sm mt-3">Lihat pengalaman mereka menyewa kamera melalui platform kami.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="p-8 md:p-10 rounded-3xl border border-black/10 bg-white text-center relative shadow-sm">
            <span className="text-6xl text-primary/20 font-serif absolute top-4 left-6 select-none">&ldquo;</span>
            <p className="text-base md:text-lg italic leading-relaxed">{t.comment}</p>
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-display text-sm font-semibold">{t.name}</h4>
              <p className="text-xs text-text-tertiary">{t.role}{t.project ? ` · ${t.project}` : ''}</p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${index === i ? 'bg-primary w-6' : 'bg-black/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### 18. `src/components/landing/FAQAccordion.tsx`
```tsx
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown } from 'lucide-react';

type FAQ = { id: string; question: string; answer: string };

export function FAQAccordion() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    createClient().from('faqs').select('*').eq('is_visible', true).order('sort_order').then(({ data }) => {
      if (data) setFaqs(data);
    });
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 border-t border-black/10 bg-surface-dark">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">Pertanyaan Populer</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = open.has(faq.id);
            return (
              <div key={faq.id} className={`rounded-2xl border transition-all ${isOpen ? 'border-primary/50 bg-primary/5' : 'border-black/10 bg-white hover:border-black/20'}`}>
                <button onClick={() => setOpen(prev => { const n = new Set(prev); isOpen ? n.delete(faq.id) : n.add(faq.id); return n; })}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-display text-sm font-semibold gap-4">
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-black/60 border-t border-black/10 pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

#### 19. `src/components/landing/FinalCTA.tsx`
```tsx
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-zinc-900 text-white border-t border-zinc-800">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Penawaran Terbatas Bulan Ini</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-none">
          Siap Memulai Produksi Kreatif Anda?
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Booking sekarang dan dapatkan pengalaman rental kamera profesional tanpa drama operasional.
        </p>
        <div className="pt-4">
          <Link href="/cameras"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-950 font-text font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-sm">
            Cari Kamera Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

### Phase 6: Wire Up

#### 20. `src/app/layout.tsx` (Update — tambah ToastProvider)
```tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/shared/Toast';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sewa Kamera Ryox - Rental Kamera Profesional',
  description: 'Platform rental kamera profesional dengan sistem booking online dan loyalty rewards',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-text">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pt-touch">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 21. `src/components/layout/Navbar.tsx` (Update — tambah Wishlist button + WishlistDrawer)
- Import `WishlistDrawer` dan `Heart` icon
- Tambah state `[wishlistOpen, setWishlistOpen]`
- Render Heart button dengan badge count
- Render `<WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />`

#### 22. `src/app/page.tsx` (Rewrite)
```tsx
import { createClient } from '@/lib/supabase/server';
import { HeroSearch } from '@/components/landing/HeroSearch';
import { AIAssistant } from '@/components/landing/AIAssistant';
import { AIBudgetPlanner } from '@/components/landing/AIBudgetPlanner';
import { CatalogSection } from '@/components/landing/CatalogSection';
import { WhyUs } from '@/components/landing/WhyUs';
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default async function Home() {
  const supabase = await createClient();
  const { data: cameras } = await supabase
    .from('cameras')
    .select('id, name, brand, type, price_per_day, image_url, is_available, stock')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  const brands = [...new Set(cameras?.map(c => c.brand) ?? [])].sort() as string[];
  const types = [...new Set(cameras?.map(c => c.type) ?? [])].sort() as string[];

  return (
    <div className="min-h-screen bg-white text-text-dominant">
      <HeroSearch />
      <AIAssistant />
      <AIBudgetPlanner />
      <CatalogSection initialCameras={cameras ?? []} brands={brands} types={types} />
      <WhyUs />
      <TestimonialsCarousel />
      <FAQAccordion />
      <FinalCTA />
    </div>
  );
}
```

---

## 🎨 Design System

| Token | Light Value | Catatan |
|---|---|---|
| `bg-white` / `bg-surface-dark` | #FFFFFF / #F5F5F7 | Background utama |
| `text-text-dominant` | #1D1D1F | Body text |
| `text-black/60` | rgba(0,0,0,0.6) | Secondary text |
| `text-text-tertiary` | #6E6E73 | Tertiary / label |
| `border-black/10` | rgba(0,0,0,0.1) | Borders |
| `bg-primary` | #0071E3 | Apple blue CTA |
| `bg-primary/10` | rgba(0,113,227,0.1) | Subtle blue bg |
| `text-primary` | #0071E3 | Primary text |
| `bg-zinc-900` | #18181B | Dark section bg (AIBudgetPlanner) |
| `text-white` | #FFFFFF | Text on dark bg |

---

## ⚠️ Risk Assessment

| Risk | Level | Mitigation |
|---|---|---|
| Gemini API quota exceeded | Low | Rate limit per user di API route |
| Wishlist race condition | Low | Supabase RLS handles user scoping |
| Existing pages break | Very Low | Hanya touch page.tsx + layout.tsx + Navbar.tsx |
| Build error dari 22 file baru | Low | Build test setiap phase |
| Gemini API key leak | Medium | Server-side ONLY via /api/ai/gemini, never expose to client |

---

## ✅ Testing Checklist

- [ ] `npm run build` — no TS/lint errors ✅
- [ ] `npm run dev` — landing page loads ✅
- [ ] HeroSearch — search bar works, scrolls to catalog ✅
- [ ] AI Assistant — Gemini responds ✅
- [ ] AI Budget Planner — Gemini responds ✅
- [ ] CatalogSection — filter/sort/pagination works ✅
- [ ] CatalogSection — wishlist add/remove works ✅
- [ ] CameraDetailModal — tabs work, "Sewa Kamera Ini" redirects ✅
- [ ] CameraDetailModal — AI Advisor tab responds ✅
- [ ] TestimonialsCarousel — fetches from Supabase ✅
- [ ] FAQAccordion — fetches from Supabase ✅
- [ ] Toast — notifications work ✅
- [ ] WishlistDrawer — open/close, items listed ✅
- [ ] Navbar — wishlist badge count ✅
- [ ] Responsive — mobile view OK ✅

---

## 🧠 Agent Assignment Per Phase

| Phase | Files | Recommended Agent | Notes |
|---|---|---|---|
| **0** Setup | `.env.local` | `planner` | Tambah GEMINI_API_KEY, verify .gitignore |
| **1** Database | 3 migration SQL | `database administrator` | Buat table + RLS + seed data via Supabase MCP/Dashboard |
| **2** API Routes | `api/ai/gemini/route.ts`, `api/wishlist/route.ts` | `backend developer` | Server-side proxy + CRUD wishlist |
| **3** Library | `lib/gemini.ts`, `lib/wishlist.ts` | `backend developer` | Client wrapper functions |
| **4** Shared | `Toast.tsx`, `WishlistDrawer.tsx` | `ui ux designer` + `frontend developer` | Toast context provider + slide-in panel |
| **5a** Landing (Hero + AI) | `HeroSearch.tsx`, `AIAssistant.tsx`, `AIBudgetPlanner.tsx` | `frontend developer` | Hero + 2 Gemini-powered sections |
| **5b** Landing (Catalog) | `CatalogSection.tsx`, `CameraDetailModal.tsx` | `frontend developer` | Filter/grid + modal dengan AI tab |
| **5c** Landing (Static) | `WhyUs.tsx`, `TestimonialsCarousel.tsx`, `FAQAccordion.tsx`, `FinalCTA.tsx` | `frontend developer` | Static sections + Supabase fetch |
| **6** Wire Up | `layout.tsx`, `Navbar.tsx`, `page.tsx` | `frontend developer` | Integrate all components |
| **7** Test | Build + dev server | `QA tester` | Build test + visual verification |

### Tips Eksekusi

1. **Jangan lakukan semua phase sekaligus** — minta Hermes kerjakan **1 phase per prompt**
2. **Prompt utuh ada di PROMPTS.md** bagian "Prompt Hybrid Landing Page + AI Gemini"
3. **Kalau ada error build** — fix dulu sebelum lanjut ke phase berikutnya
4. **Test tiap phase** dengan `npm run build` setelah phase 4, 5, dan 6

---

*Happy coding! 🚀*
