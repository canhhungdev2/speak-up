# Tính năng 07 — Admin Panel (Hệ thống Quản trị)

## Mô tả
Giao diện dành riêng cho quản trị viên để quản lý nội dung khóa học, bài học, từ vựng và người dùng.

## Đường dẫn
- **URL**: `/admin`
- **File**: `frontend/src/app/features/admin/dashboard/dashboard.component.ts`
- **Layout**: `AdminLayout` (Sidebar chuyên biệt)

## Các thành phần giao diện

### 1. Dashboard Stats
Hiển thị các chỉ số tổng quan của hệ thống:
- Tổng người dùng (kèm % tăng trưởng)
- Doanh thu
- Bài học đã hoàn thành
- Tỷ lệ hoàn thành trung bình

### 2. Sidebar Điều hướng
- Dashboard
- Quản lý khóa học (Courses)
- Quản lý người dùng (Users)

### 3. Recent Activity Table
Bảng hiển thị các hoạt động mới nhất của người dùng trên hệ thống, bao gồm:
- Tên người dùng
- Hành động thực hiện
- Thời gian (time ago)
- Trạng thái (Thành công, Mới, v.v.)

## TODO / Còn thiếu
- [ ] Xây dựng màn hình danh sách Khóa học (Course List management)
- [ ] Xây dựng màn hình danh sách Bài học (Lesson List management)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [ ] Chức năng Load More / Pagination cho các bảng dữ liệu
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề)
