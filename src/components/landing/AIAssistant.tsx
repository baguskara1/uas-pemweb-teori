'use client';
import { AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { callGeminiAI } from '@/lib/gemini';

const SYSTEM_PROMPT = `Anda adalah asisten AI ahli peralatan kamera dan videografi dari Sewa Kamera Ryox yang BERTANGGUNG JAWAB.

ATURAN PENTING:
1. Jika input pengguna tidak masuk akal, tidak jelas, atau tidak terkait kamera/videografi (misalnya angka acak, huruf acak, spam), maka Anda HARUS menjawab dengan: "Maaf, input tidak dikenali. Silakan jelaskan konsep syuting atau kebutuhan kamera Anda dengan lebih jelas. Contoh: Saya ingin syuting video cinematic di dalam ruangan dengan cahaya minim."
2. JANGAN PERNAH merekomendasikan kamera atau membuat asumsi jika input tidak jelas.
3. Hanya berikan rekomendasi alat jika pengguna menjelaskan kebutuhan syuting mereka dengan jelas.

Jika input VALID, tugas Anda adalah memformulasikan rekomendasi alat terbaik dari katalog kami.
Format respon dengan bahasa Indonesia yang profesional, berikan tips pengaturan teknis (ISO, aperture, fps, color profile) yang spesifik.
Gunakan bullet points. Respon harus premium dan informatif.`;

const quickScenarios = [
  'Cinematic Pre-Wedding',
  'Vlog Malam Ekstrem',
  'Konser Musik Redup',
  'Wawancara Studio',
];

export function AIAssistant() {
  const { show } = useToast();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidInput = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 4) return false;
    const hasLetter = /[a-zA-Z\u00C0-\u024F]/.test(trimmed);
    if (!hasLetter) return false;
    const digitsOnly = /^\d+$/.test(trimmed);
    if (digitsOnly) return false;
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    if (!isValidInput(input)) {
      setError('');
      setResponse('');
      show('Input tidak dikenali. Jelaskan kebutuhan syuting Anda dengan jelas.', 'info');
      setResponse('Maaf, input tidak dikenali. Silakan jelaskan konsep syuting atau kebutuhan kamera Anda dengan lebih jelas.\n\nContoh: *"Saya ingin syuting video cinematic di dalam ruangan dengan cahaya minim untuk konten YouTube."*');
      return;
    }

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
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bertenaga Claude Sonnet 4.5</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Asisten Pribadi Ryoxi
          </h2>
          <p className="text-black/60 text-sm">
            Jelaskan ide syuting atau konsep kreatif Anda. Biarkan AI merancang rekomendasi paket
            sewa dan panduan teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-3xl border border-black/10 bg-white shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="ai-input"
                  className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block"
                >
                  Jelaskan Konsep Syuting Anda:
                </label>
                <textarea
                  id="ai-input"
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
                {quickScenarios.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() =>
                      setInput(
                        `Saya merencanakan syuting proyek: ${sug}. Rekomendasikan set kamera terbaik beserta setelan ISO, aperture, fps, dan color profile yang pas.`,
                      )
                    }
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

          <div className="lg:col-span-7">
            {response ? (
              <div className="p-6 md:p-8 rounded-3xl border border-black/10 bg-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Hasil Rekomendasi AI Gemini
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    Aktif
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-surface-dark text-sm leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                  {response}
                </div>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>Setiap paket bisa disewa langsung di katalog.</span>
                  <button
                    type="button"
                    onClick={scrollToCatalog}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    Buka Katalog <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed border-black/10 bg-surface-dark text-center space-y-4">
                <Sparkles className="w-12 h-12 text-black/20 mx-auto" />
                <p className="text-sm text-text-tertiary max-w-md mx-auto">
                  Ketik Konsep Proyek Anda, Lalu Asisten Ryoxi akan menyusun detail rekomendasi gear
                  dan tips.
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
