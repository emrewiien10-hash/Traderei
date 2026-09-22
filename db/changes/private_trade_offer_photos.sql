insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('trade-photos','trade-photos',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Trade photo participant read" on storage.objects for select to authenticated
using (bucket_id='trade-photos' and exists(select 1 from public.conversations c where c.id::text=(storage.foldername(name))[1] and auth.uid() in (c.buyer_id,c.seller_id)));
create policy "Trade photo owner upload" on storage.objects for insert to authenticated
with check (bucket_id='trade-photos' and (storage.foldername(name))[2]=auth.uid()::text and exists(select 1 from public.conversations c where c.id::text=(storage.foldername(name))[1] and auth.uid() in (c.buyer_id,c.seller_id)));
create policy "Trade photo owner cleanup" on storage.objects for delete to authenticated
using (bucket_id='trade-photos' and (storage.foldername(name))[2]=auth.uid()::text);