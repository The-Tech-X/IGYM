-- Allow admin_users (any authenticated admin/editor) to upload, update,
-- and delete objects in the 5 content buckets. Public read is already
-- granted by the buckets being marked public.

create policy "Admins can upload images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('trainer-images', 'transformation-images', 'article-images', 'cafe-images', 'avatars')
    and auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can update images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('trainer-images', 'transformation-images', 'article-images', 'cafe-images', 'avatars')
    and auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can delete images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('trainer-images', 'transformation-images', 'article-images', 'cafe-images', 'avatars')
    and auth.uid() in (select id from public.admin_users)
  );
