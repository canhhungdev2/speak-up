# Tính năng 03 & 04 — Course List & Lesson List

## 03 — Danh sách Khóa học

### Đường dẫn
- **URL**: `/learner/courses`
- **File**: `frontend/src/app/features/learner/courses/course-list.component.ts`

### Thành phần giao diện
- **Header**: Tiêu đề + mô tả
- **Category Filter**: Nút lọc (Tất cả / Cơ bản / Giao tiếp) — chưa có logic lọc
- **Course Grid**: Lưới 3 cột responsive, mỗi thẻ gồm:
  - Ảnh thumbnail + Badge cấp độ
  - Tên khóa học + Mô tả
  - Rating + Số bài học
  - Nút mũi tên

### Điều hướng
Click vào thẻ khóa học → `/learner/courses/:id`

### Dữ liệu mẫu
| ID | Tên khóa | Cấp độ | Số bài |
|---|---|---|---|
| 1 | Original English | Cơ bản | 7 |
| 2 | Real English | Mọi cấp độ | 30 |
| 3 | Flow English | Trung cấp | 15 |

---

## 04 — Danh sách Bài học

### Đường dẫn
- **URL**: `/learner/courses/:id`
- **File**: `frontend/src/app/features/learner/courses/lesson-list.component.ts`

### Thành phần giao diện

#### Hero Section (Course Header)
- Ảnh nền lớn với overlay gradient
- Tên khóa học + Cấp độ
- Thanh tiến độ (Progress Bar) — hardcode 40%

#### Danh sách bài học
Mỗi dòng gồm:
- Số thứ tự bài
- Tên bài học
- Loại bài: `Video | Audio | Story | Quiz`
- Thời lượng (ví dụ: `15m`)
- Trạng thái:
  - ✅ Hoàn thành (icon tick xanh)
  - ▶️ Chưa học (nút "Học ngay")

## TODO / Còn thiếu
- [ ] API `GET /courses` để lấy danh sách thật
- [ ] API `GET /courses/:id/lessons` để lấy bài học
- [ ] Logic lọc theo Category ở trang Course List
- [ ] Tiến độ học tập thật từ `user_progress` table
- [ ] Click "Học ngay" điều hướng vào màn hình học bài
- [ ] Khóa bài học (chỉ mở khi xong bài trước)
