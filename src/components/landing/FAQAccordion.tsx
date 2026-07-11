'use client';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export function FAQAccordion() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    createClient()
      .from('faqs')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setFaqs(data);
      });
  }, []);

  if (faqs.length === 0) return null;

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-20 border-t border-black/10 bg-surface-dark">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
            Pertanyaan Populer
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = open.has(faq.id);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-black/10 bg-white hover:border-black/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-display text-sm font-semibold gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`}
                  />
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
