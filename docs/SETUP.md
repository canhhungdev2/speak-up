# Hướng dẫn Thiết lập Dự án SpeakUp (Setup Guide)

Chào mừng bạn đến với dự án SpeakUp! Tài liệu này sẽ hướng dẫn bạn từng bước để cài đặt môi trường và chạy dự án trên máy tính cục bộ.

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:
- **Node.js**: Phiên bản 18.x trở lên.
- **npm**: Thường đi kèm với Node.js.
- **Git**: Để clone mã nguồn.
- **Tài khoản Supabase**: Để quản lý Database và Authentication.

---

## 🚀 Các bước cài đặt

### Bước 1: Clone dự án

Mở terminal và chạy lệnh:
```bash
git clone https://github.com/your-username/speak-up.git
cd speak-up
```

### Bước 2: Cấu hình Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường:
   Sao chép file `.env.example` thành `.env` và cập nhật thông tin:
   ```bash
   cp .env.example .env
   ```
   *Lưu ý: Bạn cần lấy `DATABASE_URL` từ Supabase Dashboard (Settings -> Database -> Connection String).*

### Bước 3: Cấu hình Frontend

1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Cấu hình Supabase trong code:
   Mở file `frontend/src/environments/environment.ts` và điền thông tin dự án Supabase của bạn:
   ```typescript
   export const environment = {
     production: false,
     supabaseUrl: 'YOUR_SUPABASE_URL',
     supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```

### Bước 4: Thiết lập Database trên Supabase

1. **Tạo Project mới** trên [Supabase](https://supabase.com/).
2. **Khởi tạo bảng**: Backend sử dụng TypeORM với tính năng `synchronize: true`, các bảng sẽ tự động được tạo khi bạn chạy backend lần đầu tiên.
3. **Chạy SQL Scripts**: Truy cập vào **SQL Editor** trên Supabase và chạy các file trong `backend/database/scripts/` theo thứ tự:
   - `01-sync-user-trigger.sql`: Tự động tạo profile và đồng bộ email người dùng.

### Bước 5: Chạy ứng dụng

Mở 2 cửa sổ terminal riêng biệt:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run start
```

Ứng dụng sẽ khả dụng tại: `http://localhost:4200`

---

## 🛠 Troubleshooting (Xử lý sự cố)

- **Lỗi Port 3000 đã bị sử dụng**: Backend mặc định chạy trên port 3000. Bạn có thể đổi trong file `.env` bằng cách sửa biến `PORT`.
- **Lỗi Kết nối Database**: Kiểm tra xem địa chỉ IP của bạn đã được thêm vào "IP Allowlist" trên Supabase chưa (nếu có bật tính năng này).
- **Lỗi Google Login**: Đảm bảo bạn đã cấu hình Redirect URL trong Supabase Auth là `http://localhost:4200/learner/courses`.

---
*Cập nhật lần cuối: 07/05/2026*
