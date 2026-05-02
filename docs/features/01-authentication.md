# Tính năng 01 — Authentication (Xác thực)

## Mô tả
Hệ thống xác thực người dùng. Để tối ưu trải nghiệm "1-click", ứng dụng ưu tiên sử dụng **Social Login (Google/Facebook)** qua Supabase Auth và loại bỏ form đăng ký thủ công.

## Đường dẫn
- **Auth URL**: `/register`
- **File**: `frontend/src/app/features/auth/register.component.ts`

## Luồng xác thực (Dự kiến)

```
User → Click "Tiếp tục với Google" → Supabase Auth (OAuth) → JWT Token
                                                        ↓
                                              Backend verify token
                                                        ↓
                                              Đồng bộ dữ liệu vào bảng 'profiles'
                                                        ↓
                                              Truy cập /learner/* hoặc /admin/*
```

## Phân quyền theo Role
Dữ liệu người dùng từ Google sẽ được ánh xạ vào bảng `profiles` với role mặc định là `learner`.

| Role | Quyền hạn | Redirect đến |
|---|---|---|
| `learner` | Học viên | `/learner` |
| `admin` | Quản trị viên | `/admin` |

## TODO / Công việc cần làm
- [x] Thiết kế lại giao diện tối giản (Social Login focus)
- [ ] Cài đặt `@supabase/supabase-js` ở Frontend
- [ ] Triển khai `AuthService.signInWithGoogle()`
- [ ] Cấu hình Google Cloud Console (Client ID/Secret)
- [ ] Cấu hình Google Provider trong Supabase Dashboard
- [ ] Viết Supabase Function/Trigger để tự động chèn dữ liệu vào bảng `profiles` khi có user mới từ Auth.
- [ ] Implement Angular Route Guard (`AuthGuard`) bảo vệ các route private.
