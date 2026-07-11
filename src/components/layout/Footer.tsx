import { Camera, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-dark text-text-dominant border-t border-black/10">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-primary" />
              <span className="font-display font-semibold text-text-dominant">
                Sewa Kamera Ryox
              </span>
            </Link>
            <p className="font-text text-black/60 max-w-md">
              Platform Sewa Kamera Profesional Dengan Budget Yang Bisa Disesuaikan.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-text-dominant">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cameras"
                  className="font-text text-black/60 hover:text-primary transition-colors"
                >
                  Katalog Kamera
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="font-text text-black/60 hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="font-text text-black/60 hover:text-primary transition-colors"
                >
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-text-dominant">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-text text-black/60">
                <Mail className="w-4 h-4 text-primary" />
                rioardiyansyah33@gmail.com
              </li>
              <li className="flex items-center gap-2 font-text text-black/60">
                <Phone className="w-4 h-4 text-primary" />
                +62 831-8874-91219
              </li>
              <li className="flex items-center gap-2 font-text text-black/60">
                <MapPin className="w-4 h-4 text-primary" />
                Godean, Yogyakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/10 mt-8 pt-8 text-center">
          <p className="font-text text-black/40 text-sm">
            © {new Date().getFullYear()} Sewa Kamera Ryox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
