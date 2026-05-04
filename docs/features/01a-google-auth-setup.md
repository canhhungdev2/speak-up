# Hướng dẫn thiết lập Google Auth với Supabase

Tài liệu này hướng dẫn chi tiết cách cấu hình Google Cloud và Supabase để tích hợp tính năng đăng nhập Google cho SpeakUp.

---

### PHẦN 1: Lấy thông tin từ Google Cloud

1.  **Truy cập**: Vào [Google Cloud Console](https://console.cloud.google.com/).
2.  **Tạo Dự án**: Nhấn vào danh sách dự án ở góc trên bên trái -> **New Project** -> Đặt tên là `SpeakUp` -> **Create**.
3.  **Cấu hình Màn hình đồng ý (OAuth Consent Screen)**:
    *   Vào menu **APIs & Services** > **OAuth consent screen**.
    *   Chọn **External** -> **Create**.
    *   **App information**: Điền tên ứng dụng (`SpeakUp`) và Email hỗ trợ của bạn.
    *   **Developer contact info**: Điền email của bạn.
    *   Nhấn **Save and Continue** qua các bước tiếp theo.
4.  **Tạo thông tin xác thực (Credentials)**:
    *   Vào menu **APIs & Services** > **Credentials**.
    *   Nhấn **+ Create Credentials** > **OAuth client ID**.
    *   **Application type**: Chọn **Web application**.
    *   **Name**: Đặt là `SpeakUp Web`.
    *   **Authorized JavaScript origins**: Điền `http://localhost:4200`.
    *   **Authorized redirect URIs**: Dán URL lấy từ Supabase (Xem Bước 1 ở PHẦN 2).
5.  **Lấy chìa khóa**: Sau khi nhấn **Create**, copy **Client ID** và **Client Secret**.

---

### PHẦN 2: Cấu hình trên Supabase Dashboard

1.  **Lấy Redirect URI**:
    *   Mở [Supabase Dashboard](https://supabase.com/dashboard).
    *   Vào **Authentication** > **Providers** > **Google**.
    *   Copy **Callback URL** ở dưới cùng và dán vào Google Cloud (Bước 4 ở PHẦN 1).
2.  **Bật Google Provider**:
    *   Gạt nút **Enable Google Provider** sang màu xanh.
    *   Dán **Client ID** và **Client Secret** vào.
    *   Nhấn **Save**.
3.  **Cấu hình Frontend**:
    *   Vào **Project Settings** > **API**.
    *   Copy **Project URL** và **anon key**.
    *   Dán vào file `frontend/src/environments/environment.ts`.

---

### PHẦN 3: Đồng bộ Database (SQL)

Vào mục **SQL Editor** trên Supabase, tạo New Query và chạy đoạn mã này:

```sql
-- 1. Hàm xử lý khi có user mới
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'), 
    'learner'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Trigger tự động chạy hàm trên
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
