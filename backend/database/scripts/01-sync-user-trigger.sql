-- File: 01-sync-user-trigger.sql
-- Mô tả: Tự động tạo bản ghi trong bảng public.profiles khi có user mới đăng ký qua Supabase Auth.

-- 1. Hàm xử lý logic đồng bộ
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Learner'), 
    'learner'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Trigger lắng nghe sự kiện INSERT trên bảng auth.users
-- Lưu ý: Nếu setup lại từ đầu, cần xóa trigger cũ nếu đã tồn tại trước khi tạo mới.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
