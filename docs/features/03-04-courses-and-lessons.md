# Tính năng 03 & 04 — Course List & Lesson List

## 03 — Danh sách Khóa học

### Đường dẫn
- **URL**: `/learner/courses`
- **File**: `frontend/src/app/features/learner/courses/course-list.component.ts`

### Thành phần giao diện
- **Header**: Tiêu đề "Khám phá Khóa học 📚" + mô tả
- **Category Filter**: Nút lọc (Tất cả / Cơ bản / Giao tiếp) — chưa có logic lọc
- **Course Grid**: Lưới 3 cột responsive, mỗi thẻ gồm:
  - Ảnh thumbnail (hiển thị qua `MediaUrlPipe`) + Badge cấp độ
  - Tên khóa học + Mô tả
  - Rating + Số bài học
  - Nút mũi tên điều hướng

### Dữ liệu
- Lấy từ API `GET /courses` qua `CourseService.findAll()`.
- Danh sách được sắp xếp theo `order_index` (cấu hình từ Admin).
- Các lessons được đếm (`lessons_count`) và sắp xếp theo `order_index` trong nested relation.

### Điều hướng
Click vào thẻ khóa học → `/learner/courses/:courseSlug`

---

## 04 — Danh sách Bài học

### Đường dẫn
- **URL**: `/learner/courses/:courseSlug`
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

### Dữ liệu
- Bài học được sắp xếp theo `order_index` từ Admin.
- Backend đảm bảo sorting ở cả 2 cấp:
  - `CoursesService.findAll()`: sort `lessons` theo `order_index: 'ASC'`.
  - `LessonsService.findAllByCourse()`: sort theo `order_index: 'ASC'`.

### Điều hướng
Click "Học ngay" → `/learner/courses/:courseSlug/lessons/:lessonSlug`

## TODO / Còn thiếu
- [x] API `GET /courses` để lấy danh sách thật
- [x] API `GET /courses/:slug` để lấy chi tiết khóa học
- [x] Hiển thị bài học theo thứ tự `order_index` từ Admin
- [ ] Logic lọc theo Category ở trang Course List
- [ ] Tiến độ học tập thật từ `user_progress` table
- [ ] Khóa bài học (chỉ mở khi xong bài trước)
