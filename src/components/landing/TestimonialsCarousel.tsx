'use client';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  comment: string;
  rating: number;
  project: string | null;
};

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    createClient()
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .then(({ data }) => {
        if (data) setTestimonials(data);
      });
  }, []);

  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <section className="py-20 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Komentar Para Penyewa
          </h2>
          <p className="text-black/60 text-sm mt-3">
            Lihat pengalaman mereka menyewa kamera melalui platform kami.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="p-8 md:p-10 rounded-3xl border border-black/10 bg-white text-center relative shadow-sm">
            <span className="text-6xl text-primary/20 font-serif absolute top-4 left-6 select-none">
              &ldquo;
            </span>
            <p className="text-base md:text-lg italic leading-relaxed">{t.comment}</p>
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: t.rating }, (_, i) => i).map((s) => (
                <Star key={s} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-display text-sm font-semibold">{t.name}</h4>
              <p className="text-xs text-text-tertiary">
                {t.role}
                {t.project ? ` \u00B7 ${t.project}` : ''}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((tm, i) => (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${index === i ? 'bg-primary w-6' : 'bg-black/10'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
