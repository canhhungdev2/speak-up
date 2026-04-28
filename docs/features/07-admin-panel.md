# Tính năng 07 — Admin Panel (Hệ thống Quản trị)

## Mô tả
Giao diện quản trị cao cấp dành cho quản trị viên, được thiết kế theo phong cách hiện đại (Glassmorphism) với hiệu ứng viền neon phát sáng. Hỗ trợ đầy đủ chế độ Sáng/Tối.

## Đường dẫn
- **URL**: `/admin`
- **Bố cục chính (Layout)**: `frontend/src/app/features/admin/layout/admin-layout.component.ts`
- **Trang Dashboard**: `frontend/src/app/features/admin/dashboard/dashboard.component.ts`

## Các thành phần giao diện mới

### 13. Hệ thống Layout & Sidebar
- **Sidebar**: Thiết kế tinh tế với logo thương hiệu, các mục điều hướng có hiệu ứng hover và active rõ rệt.
- **Thu gọn Sidebar (Toggle)**: Nút chuyển đổi nhanh ở Header cho phép thu gọn Sidebar thành dạng icon-only, giúp mở rộng diện tích soạn thảo.
- **Theme Toggle**: Nút chuyển đổi nhanh giao diện Sáng/Tối tích hợp ở cuối Sidebar.
- **Header**: Chứa nút Toggle Sidebar, tiêu đề chào mừng và các công cụ tìm kiếm/thông báo.

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

### 5. Quản lý Bài học Đa màn hình (Advanced Lesson Editor)
- **Cấu trúc**: Chuyển đổi từ form đơn lẻ sang hệ thống Tabbed Navigation chuyên sâu.
- **File Layout**: `frontend/src/app/features/admin/lessons/admin-lesson-edit.component.ts`
- **Các phân hệ (Sections)**:
    - **Main Article**: 
        - **Audio Upload**: Tích hợp trình tải lên kéo thả chuyên nghiệp, hỗ trợ progress bar và nghe thử trực tiếp. Tự động đổi tên file thành `MainArticle.mp3` để chuẩn hóa.
        - **Unified Rich Editor**: Trình soạn thảo song ngữ hợp nhất (WYSIWYG). Cho phép bôi đậm, in nghiêng trực quan và tự động chia đoạn (Smart Parsing) khi lưu.
    - **Vocabulary**: Quản lý Audio từ vựng và hệ thống CRUD từ vựng đầy đủ (Thêm/Sửa/Xóa từng từ).
    - **Mini Story**: Quản lý danh sách các câu chuyện ngắn đi kèm bài học.
    - **Point Of View (POV)**: Cấu hình audio và transcript cho phần luyện ngữ pháp tự nhiên.
    - **Commentary**: Cấu hình audio và transcript cho phần giải thích chuyên sâu.
- **Tính năng đặc biệt**: 
    - Lưu độc lập cho từng phần giúp tối ưu hóa luồng công việc.
    - Hệ thống route con (child routes) cho phép truy cập trực tiếp qua URL.
    - Sử dụng **LessonEditService** để đồng bộ trạng thái bài học giữa các tab.
    - Hỗ trợ phím tắt soạn thảo chuẩn (Ctrl+B, Ctrl+I).

## Media & Storage
Hệ thống sử dụng cấu trúc lưu trữ phân cấp ngoài dự án (`STORAGE_PATH`):
- `courses/{slug}/thumbnail.webp`: Ảnh đại diện khóa học.
- `courses/{slug}/lessons/{lesson_slug}/`: Thư mục chứa media cho từng bài học.

## TODO / Còn thiếu
- [ ] Xây dựng chi tiết màn hình Quản lý người dùng (`/admin/users`)
- [ ] Xây dựng chi tiết màn hình Phân tích (`/admin/analytics`)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [x] Tích hợp API Upload tệp tin thực tế (Audio & Thumbnail)
- [x] Trình soạn thảo nội dung song ngữ WYSIWYG
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề tự động)
- [ ] Áp dụng Unified Editor và Audio Upload cho các tab Mini Story, POV
