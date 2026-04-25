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
│   ├── 03-course-list.md        # Danh sách khóa học
│   ├── 04-lesson-list.md        # Danh sách bài học
│   ├── 05-vocabulary.md         # Quản lý từ vựng
│   └── 06-srs-study.md          # Hệ thống ôn tập SRS
└── database/
    └── schema.md                # Mô tả schema database
```

## Nguyên tắc đóng góp tài liệu

- Mỗi **tính năng mới** cần có file `.md` tương ứng trong `features/`
- Dùng **tiếng Việt** cho mô tả nghiệp vụ, **tiếng Anh** cho tên kỹ thuật
- Cập nhật file này (`README.md`) khi thêm tài liệu mới

## Trạng thái tính năng

| Tính năng | Trạng thái | Ghi chú |
|---|---|---|
| Authentication | 🚧 Mock | Chưa kết nối Supabase |
| Learner Dashboard | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| Course List | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| Lesson List | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| My Vocabulary | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| SRS Study (Flashcard) | ✅ UI hoàn chỉnh | Mock SRS logic |
| Admin Panel | 🚧 Đang xây dựng | — |
