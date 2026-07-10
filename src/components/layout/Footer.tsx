import { Camera, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#161616] text-[#E8E8E8] border-t border-white/10">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-[#FDD26E]" />
              <span className="font-display font-semibold text-white">Sewa Kamera Ryox</span>
            </Link>
            <p className="font-text text-white/70 max-w-md">
              Platform rental kamera profesional dengan sistem booking online dan loyalty rewards.
              Sewa kamera impian Anda dengan mudah dan terpercaya.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-white">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cameras"
                  className="font-text text-white/70 hover:text-[#FDD26E] transition-colors"
                >
                  Katalog Kamera
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="font-text text-white/70 hover:text-[#FDD26E] transition-colors"
                >
                  Masuk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="font-text text-white/70 hover:text-[#FDD26E] transition-colors"
                >
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-white">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-text text-white/70">
                <Mail className="w-4 h-4 text-[#FDD26E]" />
                info@sewakamera.id
              </li>
              <li className="flex items-center gap-2 font-text text-white/70">
                <Phone className="w-4 h-4 text-[#FDD26E]" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2 font-text text-white/70">
                <MapPin className="w-4 h-4 text-[#FDD26E]" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="font-text text-white/50 text-sm">
            © {new Date().getFullYear()} Sewa Kamera Ryox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
