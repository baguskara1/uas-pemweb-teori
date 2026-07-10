'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type CameraFormData = {
  name: string;
  brand: string;
  type: string;
  description: string;
  price_per_day: number;
  stock: number;
  is_available: boolean;
  image_url?: string | null;
};

async function uploadImage(file: File): Promise<string | null> {
  const supabase = await createClient();
  const ext = file.name.split('.').pop();
  const filename = `cameras/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('camera-images').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return null;

  const { data } = supabase.storage.from('camera-images').getPublicUrl(filename);
  return data.publicUrl;
}

export async function createCamera(formData: FormData) {
  const supabase = await createClient();

  const imageFile = formData.get('image') as File | null;
  let image_url: string | null = null;
  if (imageFile && imageFile.size > 0) {
    image_url = await uploadImage(imageFile);
  }

  const { error } = await supabase.from('cameras').insert({
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    type: formData.get('type') as string,
    description: (formData.get('description') as string) || null,
    price_per_day: Number(formData.get('price_per_day')),
    stock: Number(formData.get('stock')),
    is_available: formData.get('is_available') === 'true',
    image_url,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/cameras');
  return { error: null };
}

export async function updateCamera(id: string, formData: FormData) {
  const supabase = await createClient();

  const imageFile = formData.get('image') as File | null;
  let image_url: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    image_url = (await uploadImage(imageFile)) ?? undefined;
  }

  const payload: Partial<CameraFormData> = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    type: formData.get('type') as string,
    description: (formData.get('description') as string) || '',
    price_per_day: Number(formData.get('price_per_day')),
    stock: Number(formData.get('stock')),
    is_available: formData.get('is_available') === 'true',
  };
  if (image_url !== undefined) payload.image_url = image_url;

  const { error } = await supabase.from('cameras').update(payload).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/cameras');
  return { error: null };
}

export async function deleteCamera(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('cameras').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/cameras');
  return { error: null };
}
