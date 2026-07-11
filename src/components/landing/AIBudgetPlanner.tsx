'use client';
import { AlertTriangle, Coins } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { callGeminiAI } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/client';

const projectTypes = [
  'Cinematic Short Film',
  'Wedding / Pre-Wedding',
  'Extreme Travel Vlog',
  'Music Video',
  'Product Photography',
];

export function AIBudgetPlanner() {
  const { show } = useToast();
  const [budgetLimit, setBudgetLimit] = useState(1000000);
  const [duration, setDuration] = useState(3);
  const [projectType, setProjectType] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setPlan('');

    const { data: cameras } = await createClient()
      .from('cameras')
      .select('id, name, brand, type, price_per_day')
      .eq('is_available', true);

    const inventoryContext = JSON.stringify(cameras ?? []);

    try {
      const result = await callGeminiAI(
        `Saya punya total budget maksimal Rp ${budgetLimit.toLocaleString('id-ID')} untuk proyek sewa kamera selama ${duration} hari. Jenis proyek: "${projectType}".
Katalog inventaris: ${inventoryContext}.
Pilihkan kombinasi sewa paling optimal. Berikan rincian harga harian dan kalkulasi total. Pastikan total TIDAK MELEBIHI budget.`,
        'Anda adalah AI Budget Planner cerdas. Racik kombinasi sewa paling optimal, fungsional, dan pastikan total biaya di bawah budget. Bahasa Indonesia.',
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
            Sebutkan budget maksimal dan lama pemakaian. AI akan memilih kamera, lensa, dan
            aksesoris optimal dari inventaris riil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-zinc-800 border border-zinc-700 p-6 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <span>Maksimal Budget</span>
                  <span className="text-primary font-semibold">
                    Rp {budgetLimit.toLocaleString('id-ID')}
                  </span>
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

              <div className="space-y-2">
                <label
                  htmlFor="budget-duration"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block"
                >
                  Durasi Sewa (Hari):
                </label>
                <div className="flex items-center gap-2" id="budget-duration">
                  {[1, 2, 3, 5, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all border ${
                        duration === d
                          ? 'bg-primary text-white border-primary'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {d} Hari
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="project-type"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block"
                >
                  Tipe Proyek:
                </label>
                <input
                  id="project-type"
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="Ketik tipe proyek Anda..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {projectTypes.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setProjectType(pt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        projectType === pt
                          ? 'bg-primary text-white border-primary'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
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
                  <Coins className="w-4 h-4" />
                  Racik Paket Kamu
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-zinc-800 border border-zinc-700 p-6 rounded-3xl flex flex-col justify-between">
            {plan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-700 pb-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Hasil Optimasi Rencana AI
                    </span>
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
                  Tentukan budget maksimal Anda menggunakan slider, pilih proyek, lalu tekan tombol
                  &ldquo;Racik Paket Kamu&rdquo;.
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
