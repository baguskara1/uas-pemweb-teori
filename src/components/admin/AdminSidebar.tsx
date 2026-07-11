'use client';

import { BarChart3, BookOpen, Camera, LogOut, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { href: '/admin', label: 'Ringkasan', icon: BarChart3, exact: true },
  { href: '/admin/cameras', label: 'Kamera', icon: Camera },
  { href: '/admin/bookings', label: 'Booking', icon: BookOpen },
  { href: '/admin/payments', label: 'Pembayaran', icon: Settings },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 border-r border-black/10 bg-white p-6 flex flex-col shrink-0">
      <div className="mb-10">
        <Link href="/" className="font-display text-xl font-bold text-text-dominant">
          Sewa Kamera Ryox
        </Link>
        <p className="mt-1 font-text text-xs text-text-tertiary">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-text text-sm transition-colors ${
                isActive
                  ? 'bg-surface-light text-text-dominant font-semibold'
                  : 'text-text-tertiary hover:bg-surface-light hover:text-text-dominant'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={signOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-text text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Keluar
      </button>
    </aside>
  );
}
