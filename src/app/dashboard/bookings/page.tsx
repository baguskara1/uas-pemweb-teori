import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { BookingsRealtimeProvider } from '@/components/dashboard/BookingsRealtimeProvider';
import { createClient } from '@/lib/supabase/server';

export default async function BookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      start_date,
      end_date,
      duration,
      final_price,
      status,
      camera:cameras (
        name,
        brand,
        image_url
      )
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Gagal memuat data booking</p>
      </div>
    );
  }

  return (
    <BookingsRealtimeProvider userId={user.id}>
      <div className="space-y-6 text-text-dominant">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-3xl font-semibold">Booking Saya</h1>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-black/10">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-black/20" />
            <h3 className="font-display text-xl font-semibold mb-2">Belum Ada Booking</h3>
            <p className="text-text-tertiary mb-6">Anda belum pernah melakukan booking kamera</p>
            <Link
              href="/cameras"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
            >
              Jelajahi Kamera
            </Link>
          </div>
        )}
      </div>
    </BookingsRealtimeProvider>
  );
}
