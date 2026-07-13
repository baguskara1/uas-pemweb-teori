'use client';

import { Edit2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteCamera } from '@/actions/camera';
import { CameraForm } from '@/components/admin/CameraForm';

type Camera = {
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

function formatCurrency(v: number): string {
  return `Rp ${Math.round(v).toLocaleString('id-ID')}`;
}

export function CamerasTable({ cameras }: { cameras: Camera[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Camera | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(c: Camera) {
    setEditing(c);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteCamera(id);
    setDeletingId(null);
    setConfirmId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold text-text-dominant">Manajemen Kamera</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-text text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Kamera
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-text text-sm">
            <thead className="bg-surface-dark text-text-tertiary">
              <tr>
                {['Kamera', 'Tipe', 'Harga/Hari', 'Stok', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {cameras.map((camera) => (
                <tr key={camera.id} className="hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-surface-dark overflow-hidden shrink-0">
                        {camera.image_url ? (
                          <Image
                            src={camera.image_url}
                            alt={camera.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-text-tertiary text-xs">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text-dominant">{camera.name}</p>
                        <p className="text-xs text-text-tertiary">{camera.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{camera.type}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    {formatCurrency(camera.price_per_day)}
                  </td>
                  <td className="px-6 py-4 text-text-dominant">{camera.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${camera.is_available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                      {camera.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(camera)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(camera.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-700 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cameras.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-tertiary">
                    Belum ada kamera
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-black/10 p-6 w-full max-w-sm">
            <h3 className="font-display text-xl font-semibold text-text-dominant mb-2">
              Hapus Kamera?
            </h3>
            <p className="font-text text-sm text-text-tertiary mb-6">
              Tindakan ini tidak bisa dibatalkan. Kamera akan dihapus permanen dari sistem.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 border border-black/15 rounded-full py-2.5 font-text text-sm text-text-dominant hover:bg-surface-dark transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deletingId === confirmId}
                onClick={() => handleDelete(confirmId)}
                className="flex-1 bg-red-600 text-white rounded-full py-2.5 font-text text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deletingId === confirmId ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit form modal */}
      {formOpen && <CameraForm camera={editing ?? undefined} onClose={closeForm} />}
    </>
  );
}
