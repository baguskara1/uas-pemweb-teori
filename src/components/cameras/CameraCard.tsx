'use client';

import { Camera, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { addToWishlist, removeFromWishlist } from '@/lib/wishlist';
import { formatCurrency } from '@/lib/utils';

type CameraCardProps = {
  camera: {
    id: string;
    name: string;
    brand: string;
    type: string;
    category: string;
    price_per_day: number;
    image_url: string | null;
    is_available: boolean;
    stock: number;
  };
};

export function CameraCard({ camera }: CameraCardProps) {
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const { show } = useToast();
  const [wishlisted, setWishlisted] = useState(() => {
    if (!user) return false;
    const key = `wishlist:${camera.id}`;
    const cached = sessionStorage.getItem(key);
    return cached === 'true';
  });
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const inCart = items.some((i) => i.id === camera.id);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (fetchedRef.current) return;
    
    const key = `wishlist:${camera.id}`;
    const cached = sessionStorage.getItem(key);
    if (cached !== null) {
      fetchedRef.current = true;
      return;
    }
    
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((d) => {
        const listed = d.data?.some((i: { camera_id: string }) => i.camera_id === camera.id) ?? false;
        setWishlisted(listed);
        fetchedRef.current = true;
        sessionStorage.setItem(key, String(listed));
      })
      .catch(() => {
        fetchedRef.current = true;
      });
  }, [user, camera.id]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      show('Login dulu untuk wishlist', 'info');
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(camera.id);
        setWishlisted(false);
        sessionStorage.setItem(`wishlist:${camera.id}`, 'false');
        show('Dihapus dari Wishlist', 'info');
      } else {
        await addToWishlist(camera.id);
        setWishlisted(true);
        sessionStorage.setItem(`wishlist:${camera.id}`, 'true');
        show('Ditambahkan ke Wishlist', 'success');
      }
    } catch (err) {
      console.error('[Wishlist] Error:', err);
      show('Gagal memperbarui wishlist', 'error');
    }
    setWishlistLoading(false);
  };

  const categoryLabel =
    camera.category === 'lens' ? 'Lensa' : camera.category === 'accessory' ? 'Aksesoris' : 'Kamera';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: camera.id,
      name: camera.name,
      brand: camera.brand,
      type: camera.type,
      category: camera.category,
      image_url: camera.image_url,
      price_per_day: camera.price_per_day,
      stock: camera.stock,
    });
    show(`${camera.name} ditambahkan ke keranjang`, 'success');
  };

  return (
    <Link
      href={`/cameras/${camera.id}`}
      data-testid="camera-card-link"
      className="group flex flex-col bg-white border border-black/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-black/15 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-[4/3] w-full bg-surface-dark overflow-hidden">
        {camera.image_url ? (
          <Image
            src={camera.image_url}
            alt={camera.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-surface-dark to-white">
            <Camera className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase">
            {categoryLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 font-text text-xs font-semibold rounded-full ${
              camera.is_available && camera.stock > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-surface-dark text-text-tertiary border border-black/10'
            }`}
          >
            {camera.is_available && camera.stock > 0 ? 'Tersedia' : 'Habis'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm shadow transition-all ${
            wishlisted
              ? 'bg-primary text-white'
              : 'bg-black/50 hover:bg-black/80 text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="font-text text-xs text-text-tertiary uppercase tracking-wider">
          {camera.brand} · {camera.type}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-text-dominant group-hover:text-primary transition-colors line-clamp-1">
          {camera.name}
        </h3>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="font-text font-semibold text-primary">
            {formatCurrency(camera.price_per_day)}{' '}
            <span className="text-xs font-normal text-text-tertiary">/ hari</span>
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!camera.is_available || camera.stock <= 0 || inCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {inCart ? 'Di Keranjang' : 'Tambah'}
          </button>
        </div>
      </div>
    </Link>
  );
}
