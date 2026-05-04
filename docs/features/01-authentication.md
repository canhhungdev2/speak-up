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

## Bảo mật Backend (NestJS)

Hệ thống sử dụng cơ chế bảo vệ 2 lớp hiện đại:

1.  **Xác thực (Authentication)**: `SupabaseAuthGuard` sử dụng thuật toán **ES256** (Asymmetric). Thay vì dùng mã Secret tĩnh, Backend sẽ tự động lấy Public Key từ Supabase thông qua cơ chế **JWKS (JSON Web Key Set)** để xác thực Token.
2.  **Phân quyền (Authorization)**: `RolesGuard` kết hợp với decorator `@Roles('admin')` để chặn các hành động sửa đổi dữ liệu từ người dùng thông thường.

### Cơ chế JWKS
Hệ thống sử dụng thư viện `jwks-rsa` để kết nối tới Discovery URL của Supabase:
`https://<project-id>.supabase.co/auth/v1/.well-known/jwks.json`
Cơ chế này cho phép tự động cập nhật khóa khi Supabase thực hiện xoay vòng khóa (key rotation).

---

## Phân quyền theo Role
Dữ liệu người dùng từ Google sẽ được ánh xạ vào bảng `profiles` với role mặc định là `learner`.

| Role | Quyền hạn | Truy cập API |
|---|---|---|
| `learner` | Học viên | Chỉ xem (GET) |
| `admin` | Quản trị viên | Toàn quyền (GET, POST, PATCH, DELETE) |

## TODO / Công việc cần làm
- [x] Thiết kế lại giao diện tối giản (Social Login focus)
- [x] Cài đặt `@supabase/supabase-js` ở Frontend
- [x] Triển khai `AuthService.signInWithGoogle()`
- [x] Cấu hình Google Cloud Console (Client ID/Secret)
- [x] Cấu hình Google Provider trong Supabase Dashboard
- [x] Viết Supabase Function/Trigger để tự động đồng bộ dữ liệu vào bảng `profiles`
- [x] Triển khai Angular Route Guard (`AuthGuard`) cho Frontend
- [x] Triển khai `SupabaseAuthGuard` cho NestJS (Backend)
- [x] Triển khai `RolesGuard` cho NestJS (Backend)
