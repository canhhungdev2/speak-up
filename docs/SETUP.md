# Hướng dẫn thiết lập dự án SpeakUp (Setup Guide)

Tài liệu này tổng hợp toàn bộ các bước để dựng lại dự án từ con số 0.

## 1. Yêu cầu hệ thống
- Node.js (v18+)
- PostgreSQL (hoặc Supabase)
- Angular CLI & NestJS CLI

## 2. Thiết lập Biến môi trường (.env)

### Backend (`/backend/.env`)
Copy file `.env.example` thành `.env` và điền các giá trị:
- `DATABASE_URL`: Đường dẫn kết nối Postgres.
- `PORT`: 3000

Cài đặt thư viện bảo mật:
```bash
cd backend
npm install jsonwebtoken jwks-rsa
```

### Frontend (`/frontend/src/environments/environment.ts`)
Điền các giá trị từ Supabase:
- `supabaseUrl`: URL dự án Supabase.
- `supabaseKey`: Anon Public Key.

## 3. Thiết lập Cơ sở dữ liệu (Database)

### Khởi tạo Schema
Sử dụng TypeORM (hoặc Prisma) để đồng bộ schema:
```bash
cd backend
npm run start:dev # Tự động tạo bảng nếu synchronize: true
```

### Chạy các Script SQL bổ sung (Quan trọng)
Truy cập **SQL Editor** trên Supabase Dashboard và chạy các file trong thư mục `backend/database/scripts/` theo thứ tự:
1. `01-sync-user-trigger.sql`: Tự động đồng bộ User từ Auth sang Profiles.

## 4. Thiết lập Authentication (Google Login)
Xem hướng dẫn chi tiết tại: [01a-google-auth-setup.md](./features/01a-google-auth-setup.md)

## 5. Chạy ứng dụng

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run start
```

---
*Cập nhật lần cuối: 03/05/2026*
