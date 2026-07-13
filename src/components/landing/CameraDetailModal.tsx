'use client';
import { Award, Camera, CheckCircle2, Loader2, ShoppingBag, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { callGeminiAI } from '@/lib/gemini';

type CameraItem = {
  id: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  is_available: boolean;
  stock: number;
  description?: string | null;
};

export function CameraDetailModal({
  camera,
  onClose,
}: {
  camera: CameraItem;
  onClose: () => void;
}) {
  const router = useRouter();
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<'specs' | 'calendar' | 'loyalty' | 'ai'>('specs');
  const [rentalDays, setRentalDays] = useState(1);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const totalPrice = camera.price_per_day * rentalDays;
  const formatCurrency = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

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
        `Kamera: ${camera.name} (${camera.brand}, ${camera.type}). Harga: Rp ${camera.price_per_day}/hari. Jawab dengan tips operasional mendalam. Bahasa Indonesia.`,
      );
      setAiResponse(res);
      show('Analisis AI siap!', 'success');
    } catch {
      setAiResponse('Maaf, gagal mendapat jawaban. Coba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  const tabs = [
    { key: 'specs' as const, label: 'Spesifikasi' },
    { key: 'calendar' as const, label: 'Kalender' },
    { key: 'loyalty' as const, label: 'Diskon' },
    { key: 'ai' as const, label: 'Tanya AI' },
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Tutup"
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-surface-dark hover:bg-primary hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-surface-dark relative">
              {camera.image_url ? (
                <Image
                  src={camera.image_url}
                  alt={camera.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-contain"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Camera className="w-16 h-16 text-primary/40" />
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl bg-surface-dark border border-black/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider">Ketersediaan</span>
              </div>
              <p className="text-xs text-text-tertiary">
                {camera.is_available
                  ? `Ada ${camera.stock} unit siap disewa`
                  : 'Sedang tidak tersedia'}
              </p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {camera.brand} &middot; {camera.type}
              </p>
              <h3 className="font-display text-2xl font-semibold mt-1">{camera.name}</h3>
            </div>

            <div className="flex gap-0 border-b border-black/10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-tertiary hover:text-text-dominant'
                  }`}
                >
                  {tab.key === 'ai' ? '✨ Tanya AI' : tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[160px]">
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    {camera.description || 'Belum ada deskripsi untuk kamera ini.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface-dark">
                      <p className="text-[10px] text-text-tertiary uppercase font-semibold">Tipe</p>
                      <p className="text-xs font-semibold mt-1">{camera.type}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-dark">
                      <p className="text-[10px] text-text-tertiary uppercase font-semibold">
                        Merek
                      </p>
                      <p className="text-xs font-semibold mt-1">{camera.brand}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={rentalDays <= 1}
                      onClick={() => setRentalDays((d) => d - 1)}
                      className="px-4 py-2 rounded-xl bg-surface-dark font-semibold disabled:opacity-40"
                    >
                      &minus;
                    </button>
                    <span className="font-display text-lg font-semibold">{rentalDays} Hari</span>
                    <button
                      type="button"
                      onClick={() => setRentalDays((d) => d + 1)}
                      className="px-4 py-2 rounded-xl bg-surface-dark font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center max-w-[280px]">
                    {[
                      { k: 0, l: 'S' },
                      { k: 1, l: 'S' },
                      { k: 2, l: 'R' },
                      { k: 3, l: 'K' },
                      { k: 4, l: 'J' },
                      { k: 5, l: 'S' },
                      { k: 6, l: 'M' },
                    ].map((d) => (
                      <span key={d.k} className="text-[10px] font-semibold text-text-tertiary py-1">
                        {d.l}
                      </span>
                    ))}
                    {Array.from({ length: 14 }, (_, i) => i + 10).map((day) => {
                      const booked = day === 12 || day === 13;
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={booked}
                          className={`py-1.5 rounded text-xs font-semibold ${
                            booked
                              ? 'bg-red-100 text-red-300 line-through cursor-not-allowed'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {day}
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
                    Sewa sebanyak 4 kali, dapatkan diskon otomatis{' '}
                    <span className="font-semibold text-primary">15% pada sewa ke-5</span> Anda!
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-10 rounded-lg flex items-center justify-center border font-semibold text-xs ${
                          s === 5
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface-dark border-black/10 text-text-tertiary'
                        }`}
                      >
                        {s === 5 ? '15%' : s}
                      </div>
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
                        Konsultasikan setting terbaik untuk {camera.name} sesuai kebutuhan proyek
                        Anda.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                      placeholder={`Tanya tentang ${camera.name}...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-black/15 bg-white text-sm focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAiAsk}
                      disabled={aiLoading || !aiQuery.trim()}
                      className="px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-text text-xs font-semibold transition-all disabled:opacity-50"
                    >
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

            <div className="p-4 rounded-2xl border border-black/10 bg-surface-dark">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-text-tertiary block font-semibold">
                    Estimasi Total ({rentalDays} Hari)
                  </span>
                  <span className="font-display text-xl font-semibold text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSewa}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-text font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Sewa {camera.category === 'camera' ? 'Kamera' : camera.category === 'lens' ? 'Lensa' : camera.type} Ini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
