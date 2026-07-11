export async function getWishlist() {
  const res = await fetch('/api/wishlist');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.data ?? [];
}

export async function addToWishlist(cameraId: string) {
  const res = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cameraId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.data;
}

export async function removeFromWishlist(cameraId: string) {
  const res = await fetch(`/api/wishlist?cameraId=${cameraId}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.success;
}
