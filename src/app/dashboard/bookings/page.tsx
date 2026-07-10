import { BookingsRealtimeProvider } from '@/components/dashboard/BookingsRealtimeProvider';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { createClient } from '@/lib/supabase/server';
import { Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';

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
      <div className="space-y-6">
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
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-light">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-text-tertiary" />
            <h3 className="font-display text-xl font-semibold mb-2">Belum Ada Booking</h3>
            <p className="text-text-tertiary mb-6">Anda belum pernah melakukan booking kamera</p>
            <a
              href="/cameras"
              className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
            >
              Jelajahi Kamera
            </a>
          </div>
        )}
      </div>
    </BookingsRealtimeProvider>
  );
}
