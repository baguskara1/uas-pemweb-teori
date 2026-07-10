'use client';

import { Calendar, LayoutDashboard, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'Booking Saya', icon: Calendar },
    { href: '/dashboard/profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className="w-64 border-r border-surface-light bg-white p-6 flex flex-col">
      <div className="mb-10">
        <Link href="/" className="font-display text-xl font-bold text-primary">
          Sewa Kamera Ryox
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-text text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-light/50'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-text text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Keluar
      </button>
    </aside>
  );
}
