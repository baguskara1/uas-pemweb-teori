'use client';
import { Camera, Heart, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getWishlist, removeFromWishlist } from '@/lib/wishlist';
import { useToast } from './Toast';

type WishlistItem = {
  id: string;
  camera_id: string;
  created_at: string;
  camera?: {
    name: string;
    brand: string;
    image_url: string | null;
    price_per_day: number;
  };
};

export function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchWishlist() {
      if (!open || !user) {
        setItems([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await getWishlist();
        if (!cancelled) {
          setItems(data);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchWishlist();
    
    return () => { cancelled = true; };
  }, [open, user]);

  const handleRemove = async (cameraId: string) => {
    await removeFromWishlist(cameraId);
    setItems((prev) => prev.filter((i) => i.camera_id !== cameraId));
    show('Dihapus dari Wishlist', 'info');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={onClose}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClose()}
          />
          {/* Mobile: bottom sheet; Desktop: side drawer */}
          <div className="absolute bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:top-0 md:right-0 md:w-full md:max-w-md md:h-full bg-white shadow-2xl overflow-y-auto rounded-t-3xl md:rounded-none">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h3 className="font-display text-lg font-semibold">Wishlist Saya</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-dark text-text-tertiary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-text-tertiary">Memuat...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Heart className="w-12 h-12 text-black/20 mx-auto" />
                  <p className="text-text-tertiary">Wishlist Anda kosong.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-xl bg-surface-dark border border-black/10"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-light shrink-0 relative">
                        {item.camera?.image_url ? (
                          <Image
                            src={item.camera.image_url}
                            alt={item.camera.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        ) : (
                          <div className="grid h-full place-items-center">
                            <Camera className="w-6 h-6 text-text-tertiary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-tertiary uppercase tracking-wider">
                          {item.camera?.brand}
                        </p>
                        <h4 className="font-display text-sm font-semibold truncate">
                          {item.camera?.name}
                        </h4>
                        <p className="text-xs text-primary font-semibold mt-1">
                          Rp {(item.camera?.price_per_day ?? 0).toLocaleString('id-ID')} / hari
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.camera_id)}
                        className="text-text-tertiary hover:text-red-500 p-1 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
