# SpeakUp — Tài liệu Dự án

Thư mục này chứa toàn bộ tài liệu kỹ thuật và mô tả chức năng của dự án **SpeakUp** — nền tảng học tiếng Anh cộng đồng, miễn phí.

## Cấu trúc thư mục `docs/`

```
docs/
├── README.md                    # File này — mục lục tổng quan
├── architecture/
│   └── overview.md              # Kiến trúc tổng thể hệ thống
├── features/
│   ├── 01-authentication.md     # Xác thực người dùng
│   ├── 02-learner-dashboard.md  # Bảng điều khiển học viên
│   ├── 03-04-courses-and-lessons.md # Khóa học và Bài học
│   ├── 05-vocabulary.md         # Quản lý từ vựng
│   ├── 06-srs-study.md          # Hệ thống ôn tập SRS
│   ├── 07-admin-panel.md        # Hệ thống quản trị (Admin)
│   └── 08-lesson-player.md      # Màn hình học bài (Song ngữ)
├── database/
│   └── schema.md                # Mô tả schema database (TypeORM)
└── workflow.md                  # Quy trình bảo trì tài liệu
```

## Nguyên tắc đóng góp tài liệu

- Mỗi **tính năng mới** cần có file `.md` tương ứng trong `features/`
- Dùng **tiếng Việt** cho mô tả nghiệp vụ, **tiếng Anh** cho tên kỹ thuật
- Cập nhật file này (`README.md`) khi thêm tài liệu mới
- **Luôn cập nhật tài liệu song song với code** (Xem [workflow.md](workflow.md))

## Trạng thái tính năng

| Tính năng | Trạng thái | Ghi chú |
|---|---|---|
| Authentication | 🚧 Mock | Chưa kết nối Supabase |
| Learner Dashboard | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| Course List | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| Lesson List | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| My Vocabulary | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| SRS Study (Flashcard) | ✅ Hoàn thiện UI | Đã thêm animation & TTS cao cấp |
| Admin Panel | ✅ Cơ bản hoàn thiện | Đã có Dashboard, Quản lý khóa học & bài học (Drag & Drop) |
| Lesson Player | ✅ Hoàn thiện UI | Giao diện song ngữ Anh - Việt |
