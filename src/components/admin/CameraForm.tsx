'use client';

import { Camera, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCamera, updateCamera } from '@/actions/camera';
import { CAMERA_TYPES, CATEGORIES } from '@/lib/constants';

type CameraItem = {
  id: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  description: string | null;
  price_per_day: number;
  stock: number;
  is_available: boolean;
  image_url: string | null;
};

export function CameraForm({ camera, onClose }: { camera?: CameraItem; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(camera?.image_url ?? null);

  const isEdit = !!camera;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const result = isEdit ? await updateCamera(camera.id, fd) : await createCamera(fd);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl border border-black/10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="font-display text-xl font-semibold text-text-dominant">
            {isEdit ? 'Edit Kamera' : 'Tambah Kamera'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-dominant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image upload */}
          <div>
            <label className="block font-text text-sm font-semibold mb-2 text-text-dominant">
              Foto Kamera
            </label>
            <div
              className="border-2 border-dashed border-black/15 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                const input = document.getElementById(
                  'camera-image-input',
                ) as HTMLInputElement | null;
                input?.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = document.getElementById(
                    'camera-image-input',
                  ) as HTMLInputElement | null;
                  input?.click();
                }
              }}
            >
              {preview ? (
                <div className="relative h-40 w-full">
                  <Image src={preview} alt="preview" fill className="object-contain rounded-lg" />
                </div>
              ) : (
                <div className="py-6 text-text-tertiary">
                  <Camera className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">Klik untuk upload foto</p>
                </div>
              )}
              <input
                id="camera-image-input"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="camera-name"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Nama Produk *
              </label>
              <input
                id="camera-name"
                name="name"
                required
                defaultValue={camera?.name}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              />
            </div>
            <div>
              <label
                htmlFor="camera-category"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Kategori *
              </label>
              <select
                id="camera-category"
                name="category"
                required
                defaultValue={camera?.category || 'camera'}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="camera-brand"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Brand *
              </label>
              <input
                id="camera-brand"
                name="brand"
                required
                defaultValue={camera?.brand}
                placeholder="Sony, Canon, Fujifilm..."
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant placeholder:text-text-tertiary"
              />
            </div>
            <div>
              <label
                htmlFor="camera-type"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Tipe *
              </label>
              <select
                id="camera-type"
                name="type"
                required
                defaultValue={camera?.type}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              >
                <option value="">Pilih tipe</option>
                {CAMERA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="camera-price"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Harga/Hari (Rp) *
              </label>
              <input
                id="camera-price"
                name="price_per_day"
                type="number"
                required
                min={0}
                defaultValue={camera?.price_per_day}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              />
            </div>
            <div>
              <label
                htmlFor="camera-stock"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Stok *
              </label>
              <input
                id="camera-stock"
                name="stock"
                type="number"
                required
                min={0}
                defaultValue={camera?.stock}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="camera-description"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Deskripsi
              </label>
              <textarea
                id="camera-description"
                name="description"
                rows={3}
                defaultValue={camera?.description ?? ''}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary resize-none bg-white text-text-dominant"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="camera-available"
                className="block font-text text-sm font-semibold mb-1 text-text-dominant"
              >
                Status
              </label>
              <select
                id="camera-available"
                name="is_available"
                defaultValue={camera ? String(camera.is_available) : 'true'}
                className="w-full border border-black/15 rounded-xl px-4 py-2.5 font-text text-sm focus:outline-none focus:border-primary bg-white text-text-dominant"
              >
                <option value="true">Tersedia</option>
                <option value="false">Tidak Tersedia</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm font-text">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-black/15 rounded-full py-2.5 font-text text-sm text-text-dominant hover:bg-surface-dark transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white rounded-full py-2.5 font-text text-sm font-semibold hover:bg-primary-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Tambah Kamera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
