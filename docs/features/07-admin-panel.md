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

### 3. Bảng Quản lý khóa học (Refined Table)
Bảng dữ liệu được thiết kế lại hoàn toàn:
- Hiển thị ảnh thumbnail khóa học với hiệu ứng zoom khi hover.
- Huy hiệu trạng thái (Status Badges) đa dạng màu sắc.
- Cột hành động với các nút Chỉnh sửa/Xóa có hiệu ứng hover nhanh.

## Cấu trúc Component
- `StatCardComponent`: Thành phần hiển thị chỉ số với hiệu ứng phát sáng tùy biến.
- `CourseTableComponent`: Thành phần bảng quản lý dữ liệu chuyên dụng.

## TODO / Còn thiếu
- [ ] Xây dựng chi tiết màn hình Quản lý người dùng (`/admin/users`)
- [ ] Xây dựng chi tiết màn hình Phân tích (`/admin/analytics`)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [ ] Tích hợp API thật cho toàn bộ các chỉ số thống kê (hiện đang dùng mock cho một số mục)
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề) tích hợp vào màn hình tạo bài học
