import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-dark">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile top nav */}
      <DashboardMobileNav />

      <main className="flex-1 p-6 md:p-12 pt-24 md:pt-12">{children}</main>
    </div>
  );
}
