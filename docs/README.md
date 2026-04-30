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
│   ├── 05-vocabulary.md         # Quản lý từ vựng (Learner)
│   ├── 06-srs-study.md          # Hệ thống ôn tập SRS
│   ├── 07-admin-panel.md        # Hệ thống quản trị (Admin)
│   ├── 08-lesson-player.md      # Màn hình học bài (Song ngữ)
│   └── 10-media-streaming.md    # Hệ thống truyền phát media
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
| Course List | ✅ Hoàn thiện | Dữ liệu thật từ API, sắp xếp theo `order_index` |
| Lesson List | ✅ Hoàn thiện | Dữ liệu thật từ API, thứ tự theo Admin |
| My Vocabulary | ✅ UI hoàn chỉnh | Dữ liệu tĩnh |
| SRS Study (Flashcard) | ✅ Hoàn thiện UI | Đã thêm animation & TTS cao cấp |
| Admin Panel | ✅ Hoàn thiện | Dashboard, CRUD khóa học/bài học, Vocabulary Drag & Drop |
| Lesson Player | ✅ Hoàn thiện | Song ngữ, audio lifecycle, mobile drawer, vocab phát âm |
| Media Streaming | ✅ Hoàn thiện | Upload/serve media, path normalization, legacy support |

## Cập nhật gần nhất
- **2026-04-30**: Cập nhật toàn bộ tài liệu phản ánh các tính năng mới:
  - Vocabulary: thêm `translation`, `definition_vi`, `order_index`, kéo thả sắp xếp
  - Lesson Player: mobile sidebar drawer, phát âm từ vựng, quản lý vòng đời audio
  - Media: chuẩn hóa đường dẫn (Windows path, JSON parsing), thumbnail tên cố định
  - Admin: Course thumbnail upload fix, Vocabulary drag & drop reorder
