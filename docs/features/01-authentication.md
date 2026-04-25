# Tính năng 01 — Authentication (Xác thực)

## Mô tả
Hệ thống đăng ký và đăng nhập người dùng. Hiện tại đang dùng logic Mock, chưa kết nối Supabase Auth thực tế.

## Đường dẫn
- **Register URL**: `/register`
- **File**: `frontend/src/app/features/auth/register.component.ts`

## Luồng xác thực (Dự kiến)

```
User → Register/Login → Supabase Auth → JWT Token
                                        ↓
                              Backend verify token
                                        ↓
                              Truy cập /learner/* hoặc /admin/*
```

## Phân quyền theo Role
| Role | Sau khi login | Redirect đến |
|---|---|---|
| `learner` | Học viên | `/learner` |
| `admin` | Quản trị viên | `/admin` |

## TODO / Còn thiếu
- [ ] Cài đặt `@supabase/supabase-js`
- [ ] Viết `AuthService` gọi `supabase.auth.signUp()` và `supabase.auth.signInWithPassword()`
- [ ] Implement Angular Route Guard (`AuthGuard`) bảo vệ route `/learner/*` và `/admin/*`
- [ ] Xử lý refresh token
- [ ] Trang đăng nhập riêng (`/login`)
