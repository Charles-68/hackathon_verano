-- Supabase Edge Function: get_all_users
-- Retorna lista de usuarios (id, email) para el panel admin
-- IMPORTANTE: Solo debe usarse por admin y con RLS adecuada

create or replace function get_all_users()
returns table (id uuid, email text)
language sql
as $$
  select id, email from auth.users order by created_at desc;
$$;
