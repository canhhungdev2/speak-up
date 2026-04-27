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
- **File**: `frontend/src/app/features/admin/courses/admin-course-list.component.ts`
- Cung cấp cái nhìn tổng quan về tất cả khóa học.
- Cho phép tìm kiếm, lọc theo cấp độ và thực hiện các hành động nhanh (Chỉnh sửa, Xóa).

### 4. Trang Chỉnh sửa/Thêm mới (Course Editor)
- **File**: `frontend/src/app/features/admin/courses/admin-course-edit.component.ts`
- Thiết kế theo Mockup cao cấp với cấu trúc 2 cột.
- Tự động sinh Slug từ Tiêu đề.
- Lựa chọn cấp độ thông qua hệ thống nút bấm đồng bộ.
- Preview ảnh Thumbnail thời gian thực.

## Media & Storage
Hệ thống sử dụng cấu trúc lưu trữ phân cấp ngoài dự án (`STORAGE_PATH`):
- `courses/{slug}/thumbnail.webp`: Ảnh đại diện khóa học.
- `courses/{slug}/lessons/{lesson_slug}/`: Thư mục chứa media cho từng bài học.

## TODO / Còn thiếu
- [ ] Xây dựng chi tiết màn hình Quản lý người dùng (`/admin/users`)
- [ ] Xây dựng chi tiết màn hình Phân tích (`/admin/analytics`)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [ ] Tích hợp API Upload tệp tin thực tế thay vì chỉ nhập URL ảnh.
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề) tích hợp vào màn hình tạo bài học
