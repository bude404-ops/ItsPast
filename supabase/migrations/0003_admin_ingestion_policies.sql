create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create policy "admins insert physical entities" on physical_entities for insert with check (public.current_user_is_admin());
create policy "admins update physical entities" on physical_entities for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins insert historical sources" on historical_sources for insert with check (public.current_user_is_admin());
create policy "admins update historical sources" on historical_sources for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins insert historical events" on historical_events for insert with check (public.current_user_is_admin());
create policy "admins update historical events" on historical_events for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins insert entity source links" on entity_sources for insert with check (public.current_user_is_admin());
create policy "admins update entity source links" on entity_sources for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
