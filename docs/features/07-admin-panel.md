# Tính năng 07 — Admin Panel (Hệ thống Quản trị)

## Mô tả
Giao diện quản trị cao cấp dành cho quản trị viên, được thiết kế theo phong cách hiện đại (Glassmorphism) với hiệu ứng viền neon phát sáng. Hỗ trợ đầy đủ chế độ Sáng/Tối.

## Đường dẫn
- **URL**: `/admin`
- **Bố cục chính (Layout)**: `frontend/src/app/features/admin/layout/admin-layout.component.ts`
- **Trang Dashboard**: `frontend/src/app/features/admin/dashboard/dashboard.component.ts`

## Các thành phần giao diện mới

### 1. Hệ thống Layout & Sidebar
- **Sidebar**: Thiết kế tinh tế với logo thương hiệu, các mục điều hướng có hiệu ứng hover và active rõ rệt.
- **Theme Toggle**: Nút chuyển đổi nhanh giao diện Sáng/Tối tích hợp ở cuối Sidebar.
- **Header**: Thanh công cụ chứa lời chào người dùng, ô tìm kiếm và thông báo.

### 2. Dashboard Stats (Glow Cards)
Sử dụng các thẻ thống kê với hiệu ứng "Glow" (phát sáng) theo màu sắc đại diện:
- **Tổng học viên**: Màu Hồng (Rose)
- **Khóa học hiện có**: Màu Tím (Purple) - Lấy dữ liệu thật từ database.
- **Tỷ lệ hoàn thành**: Màu Xanh lục (Emerald) - Kèm biểu đồ sparkline.
- **Doanh thu tháng**: Màu Xanh dương (Blue) - Kèm biểu đồ cột.

### 3. Bảng Quản lý khóa học (Courses List)
- Cho phép tìm kiếm, lọc theo cấp độ và thực hiện các hành động nhanh: Chỉnh sửa, Xóa, và **Quản lý bài học**.
- **Quản lý bài học**: Nút biểu tượng "Quyển sách" (màu Emerald) chuyển hướng đến danh sách bài học của khóa học đó.

### 4. Quản lý danh sách bài học (Lessons List)
- **File**: `frontend/src/app/features/admin/lessons/admin-lesson-list.component.ts`
- **URL**: `/admin/courses/:courseSlug/lessons`
- Hiển thị danh sách bài học theo thứ tự.
- **Kéo thả (Drag & Drop)**: Sử dụng Angular CDK để thay đổi thứ tự học tập trực quan.
- Tự động cập nhật `order_index` vào database.

### 5. Trang Chỉnh sửa bài học (Lesson Editor)
- **File**: `frontend/src/app/features/admin/lessons/admin-lesson-edit.component.ts`
- **URL**: `/admin/courses/:courseSlug/lessons/edit/:lessonSlug`
- Hỗ trợ đầy đủ thông tin: Tiêu đề, Loại (Video/Audio/Story/Quiz), Content URL, Thời lượng.
- **Trình soạn thảo song ngữ (Bilingual Editor)**: Quản lý mảng nội dung Anh - Việt theo dạng thẻ, dễ dàng thêm/bớt và chỉnh sửa lời thoại.

## Media & Storage
Hệ thống sử dụng cấu trúc lưu trữ phân cấp ngoài dự án (`STORAGE_PATH`):
- `courses/{slug}/thumbnail.webp`: Ảnh đại diện khóa học.
- `courses/{slug}/lessons/{lesson_slug}/`: Thư mục chứa media cho từng bài học.

## TODO / Còn thiếu
- [ ] Xây dựng chi tiết màn hình Quản lý người dùng (`/admin/users`)
- [ ] Xây dựng chi tiết màn hình Phân tích (`/admin/analytics`)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [ ] Tích hợp API Upload tệp tin thực tế thay vì chỉ nhập URL ảnh.
- [x] Trình soạn thảo nội dung song ngữ (Bilingual Editor) cho bài học
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề tự động)
