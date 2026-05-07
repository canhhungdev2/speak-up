-- File: 01-sync-user-trigger.sql
-- Mô tả: Tự động tạo bản ghi trong bảng public.profiles khi có user mới đăng ký qua Supabase Auth.

-- 1. Hàm xử lý logic đồng bộ
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, role)
  values (
    new.id, 
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Learner'), 
    'learner'
  )
  on conflict (id) do update 
  set 
    email = excluded.email,
    username = excluded.username
  where 
    profiles.email is null or profiles.username = 'New Learner';
  return new;
end;
$$ language plpgsql security definer;

-- 2. Trigger lắng nghe sự kiện INSERT và UPDATE trên bảng auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();
