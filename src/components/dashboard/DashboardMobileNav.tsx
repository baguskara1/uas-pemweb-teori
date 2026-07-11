'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardMobileNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Ringkasan' },
    { href: '/dashboard/bookings', label: 'Booking Saya' },
    { href: '/dashboard/profile', label: 'Profil' },
  ];

  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-black/10 px-4 flex items-center justify-between overflow-x-auto" style={{ marginTop: '44px', height: '48px' }}>
      <div className="flex items-center gap-1 min-w-0">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-tertiary hover:text-primary hover:bg-primary/10'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={signOut}
        className="shrink-0 p-1.5 text-red-500 hover:text-red-700 transition-colors ml-2"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </nav>
  );
}
