import { AuthProvider } from '@/contexts/AuthContext';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sewa Kamera Ryox - Rental Kamera Profesional',
  description:
    'Platform rental kamera profesional dengan sistem booking online dan loyalty rewards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-text">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-touch">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
