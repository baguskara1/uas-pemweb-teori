-- ============================================================================
-- Sewa Kamera Ryox - Storage bucket for camera images
-- Migration: 007_storage_camera_images.sql
-- ============================================================================

-- Create bucket (idempotent via do block)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'camera-images',
  'camera-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Allow public read
create policy "camera_images_public_read"
  on storage.objects for select
  using (bucket_id = 'camera-images');

-- Allow admin upload
create policy "camera_images_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'camera-images'
    and auth.role() = 'authenticated'
  );

-- Allow admin delete
create policy "camera_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'camera-images'
    and auth.role() = 'authenticated'
  );
