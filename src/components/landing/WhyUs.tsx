import { Award, Clock, ShieldCheck } from 'lucide-react';

const values = [
  {
    icon: ShieldCheck,
    title: 'Kamera & Lensa Steril',
    desc: 'Setiap kamera dibersihkan melalui ruang sterilisasi UV-C untuk kebersihan maksimal.',
  },
  {
    icon: Award,
    title: 'Loyalty Stamp 15%',
    desc: 'Sistem retensi pelanggan memberikan diskon 15% otomatis pada penyewaan ke-5 Anda.',
  },
  {
    icon: Clock,
    title: 'Konfirmasi Instan',
    desc: 'Sistem ketersediaan stok real-time menghilangkan risiko pemesanan ganda.',
  },
];

export function WhyUs() {
  return (
    <section className="py-20 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Mengapa Sewa Kamera Ryox?
          </h2>
          <p className="text-black/60 text-sm">
            Layanan didesain untuk memenuhi standar ketat fotografer profesional dan pembuat film
            independen.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-8 rounded-3xl border border-black/10 bg-white text-center space-y-4"
            >
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
