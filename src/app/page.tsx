import { AIAssistant } from '@/components/landing/AIAssistant';
import { AIBudgetPlanner } from '@/components/landing/AIBudgetPlanner';
import { CatalogSection } from '@/components/landing/CatalogSection';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { HeroSearch } from '@/components/landing/HeroSearch';
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel';
import { WhyUs } from '@/components/landing/WhyUs';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: cameras } = await supabase
    .from('cameras')
    .select('id, name, brand, type, category, price_per_day, image_url, is_available, stock')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  const brands = [...new Set(cameras?.map((c) => c.brand) ?? [])].sort() as string[];
  const types = [...new Set(cameras?.map((c) => c.type) ?? [])].sort() as string[];

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
