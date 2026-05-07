# SpeakUp — Nền tảng Học Tiếng Anh Cộng Đồng

![SpeakUp Logo](https://img.shields.io/badge/SpeakUp-Learning-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Developing-orange?style=for-the-badge)

**SpeakUp** là một nền tảng học tiếng Anh hiện đại, miễn phí và tập trung vào cộng đồng. Dự án được xây dựng với mục tiêu giúp người học tiếp cận các phương pháp học tiếng Anh hiệu quả như Effortless English thông qua giao diện trực quan và các tính năng hỗ trợ học tập thông minh.

## 🚀 Tính năng chính

- **Học qua Video/Audio**: Trình phát bài học song ngữ hỗ trợ điều chỉnh tốc độ, lặp đoạn.
- **SRS Vocabulary**: Hệ thống ôn tập từ vựng dựa trên phương pháp lặp lại ngắt quãng (Spaced Repetition System).
- **Gamification**: Hệ thống điểm kinh nghiệm (XP), cấp độ (Level) và chuỗi ngày học (Streak) để duy trì động lực.
- **Admin Panel**: Công cụ quản lý bài học, khóa học và media chuyên nghiệp.
- **AI Integration**: Hỗ trợ tra từ vựng và giải thích ngữ nghĩa thông minh.

## 🛠 Công nghệ sử dụng

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Quản lý qua [Supabase](https://supabase.com/))
- **ORM**: [TypeORM](https://typeorm.io/)
- **Auth**: Supabase Auth (JWT & Google OAuth)

### Frontend
- **Framework**: [Angular](https://angular.io/) (v17+)
- **Styling**: Vanilla CSS & modern UI patterns
- **State Management**: Angular Signals

## 📂 Cấu trúc dự án

```
speak-up/
├── backend/            # NestJS API Server
│   ├── src/            # Mã nguồn backend
│   └── database/       # Scripts khởi tạo DB & Triggers
├── frontend/           # Angular Web Application
│   └── src/app/        # Mã nguồn giao diện & logic frontend
└── docs/               # Tài liệu chi tiết dự án
```

## 🏁 Bắt đầu

Để cài đặt và chạy dự án trên máy cục bộ, vui lòng làm theo hướng dẫn tại:

👉 [**Hướng dẫn cài đặt chi tiết (SETUP.md)**](./docs/SETUP.md)

## 🤝 Đóng góp

Chúng tôi luôn chào đón mọi sự đóng góp. Vui lòng xem [Quy trình đóng góp](./docs/CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 Bản quyền

Dự án này là mã nguồn mở và được phát triển vì mục đích cộng đồng.

---
*Phát triển bởi đội ngũ SpeakUp*
