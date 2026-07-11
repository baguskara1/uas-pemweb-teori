import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-dark">
      <DashboardSidebar />
      <main className="flex-1 p-8 md:p-12">{children}</main>
    </div>
  );
}
