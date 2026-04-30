# Tính năng 07 — Admin Panel (Hệ thống Quản trị)

## Mô tả
Giao diện quản trị cao cấp dành cho quản trị viên, được thiết kế theo phong cách hiện đại (Glassmorphism) với hiệu ứng viền neon phát sáng. Hỗ trợ đầy đủ chế độ Sáng/Tối.

## Đường dẫn
- **URL**: `/admin`
- **Bố cục chính (Layout)**: `frontend/src/app/features/admin/layout/admin-layout.component.ts`
- **Trang Dashboard**: `frontend/src/app/features/admin/dashboard/dashboard.component.ts`

## Các thành phần giao diện

### 1. Hệ thống Layout & Sidebar
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

### 4. Chỉnh sửa khóa học (Course Edit)
- **File**: `frontend/src/app/features/admin/courses/admin-course-edit.component.ts`
- **URL**: `/admin/courses/:slug/edit` (chỉnh sửa) hoặc `/admin/courses/create` (tạo mới)
- **Thumbnail Upload**:
  - File ảnh được đặt tên cố định `thumbnail.{ext}` (ghi đè khi thay đổi).
  - Đường dẫn lưu trữ: `courses/{slug}/thumbnail.{ext}`.
  - Response trả về dạng JSON `{ url: "/media/courses/{slug}/thumbnail/thumbnail.{ext}" }`, Frontend tự động parse lấy `url`.
- **Slug Preview**: Tự động sinh đường dẫn thân thiện từ tiêu đề.
- **Level Selection**: Chọn cấp độ dạng nút bấm (Cơ bản / Trung cấp / Nâng cao / Mọi cấp độ).

### 5. Quản lý danh sách bài học (Lessons List)
- **File**: `frontend/src/app/features/admin/lessons/admin-lesson-list.component.ts`
- **URL**: `/admin/courses/:courseSlug/lessons`
- Hiển thị danh sách bài học theo thứ tự `order_index`.
- **Kéo thả (Drag & Drop)**: Sử dụng Angular CDK để thay đổi thứ tự học tập trực quan.
- Tự động cập nhật `order_index` vào database qua API `PATCH /lessons/reorder`.

### 6. Quản lý Bài học Đa màn hình (Advanced Lesson Editor)
- **Cấu trúc**: Hệ thống Tabbed Navigation chuyên sâu với route con.
- **File Layout**: `frontend/src/app/features/admin/lessons/admin-lesson-edit.component.ts`
- **Các phân hệ (Sections)**:
    - **Main Article** (`admin-lesson-article.component.ts`):
        - **Audio Upload**: Trình tải lên kéo thả chuyên nghiệp, tự động đổi tên file thành `MainArticle.mp3`.
        - **Unified Rich Editor**: Trình soạn thảo song ngữ WYSIWYG hợp nhất. Hỗ trợ bôi đậm, in nghiêng, và Smart Parsing khi lưu.
    - **Vocabulary** (`admin-lesson-vocabulary.component.ts`):
        - Quản lý Audio từ vựng (upload file `Vocabulary.mp3`).
        - Hệ thống CRUD từ vựng đầy đủ qua Modal (Thêm/Sửa/Xóa từng từ).
        - **Auto Fetch Info**: Tự động tra cứu IPA, loại từ, định nghĩa, phát âm từ Dictionary API.
        - **Trường dữ liệu**: term, ipa, word_type, definition (EN), translation (VI ngắn gọn), definition_vi (VI chi tiết), example, audio_url.
        - **Kéo thả sắp xếp thứ tự (Drag & Drop)**: Sử dụng Angular CDK DragDrop. Thay đổi thứ tự hiển thị từ vựng, tự động lưu `order_index` qua API `PATCH /vocabulary/reorder`.
    - **Mini Story** (`admin-lesson-mini-story.component.ts`): Quản lý danh sách câu chuyện ngắn đi kèm bài học.
    - **Point Of View** (`admin-lesson-pov.component.ts`): Cấu hình audio và transcript cho phần luyện ngữ pháp.
    - **Commentary** (`admin-lesson-commentary.component.ts`): Cấu hình audio và transcript cho phần giải thích chuyên sâu.
- **Tính năng đặc biệt**:
    - Lưu độc lập cho từng phần giúp tối ưu hóa luồng công việc.
    - Hệ thống route con (child routes) cho phép truy cập trực tiếp qua URL.
    - Sử dụng **LessonEditService** để đồng bộ trạng thái bài học giữa các tab.
    - Hỗ trợ phím tắt soạn thảo chuẩn (Ctrl+B, Ctrl+I).

## Media & Storage
Hệ thống sử dụng cấu trúc lưu trữ phân cấp ngoài dự án (`STORAGE_PATH`):
```
speak-up-storage/
├── courses/
│   ├── original-english/
│   │   ├── thumbnail.png              # Ảnh khóa học (tên cố định)
│   │   └── lessons/
│   │       ├── day-of-the-dead/
│   │       │   ├── MainArticle.mp3    # Audio bài chính
│   │       │   └── Vocabulary.mp3     # Audio từ vựng
│   │       └── a-kiss/
│   │           ├── MainArticle.mp3
│   │           └── Vocabulary.mp3
│   ├── real-english/
│   │   └── thumbnail.png
│   └── ...
├── audio/                              # Legacy audio files
└── vtt/                                # Legacy VTT subtitle files
```

## API Endpoints

### Courses
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/courses` | Lấy danh sách khóa học (sắp xếp theo `order_index`) |
| GET | `/courses/:slug` | Lấy chi tiết khóa học theo slug |
| POST | `/courses` | Tạo khóa học mới |
| PATCH | `/courses/:id` | Cập nhật khóa học |
| DELETE | `/courses/:id` | Xóa khóa học |
| PATCH | `/courses/reorder` | Sắp xếp lại thứ tự khóa học |

### Vocabulary
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/vocabulary/lesson/:lessonId` | Lấy từ vựng theo bài học (sắp xếp theo `order_index`) |
| POST | `/vocabulary` | Tạo từ vựng mới |
| PATCH | `/vocabulary/reorder` | Sắp xếp lại thứ tự từ vựng |
| PATCH | `/vocabulary/:id` | Cập nhật từ vựng |
| DELETE | `/vocabulary/:id` | Xóa từ vựng |

### Media
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/media/upload/course-thumbnail/:courseSlug` | Upload ảnh thumbnail khóa học |
| POST | `/media/upload/lesson-media/:courseSlug/:lessonSlug` | Upload media bài học |
| GET | `/media/courses/:courseSlug/thumbnail/:filename` | Phục vụ thumbnail khóa học |
| GET | `/media/courses/:courseSlug/lessons/:lessonSlug/:filename` | Phục vụ media bài học |
| GET | `/media/:type/:filename` | Legacy — phục vụ file media cũ |

## TODO / Còn thiếu
- [ ] Xây dựng chi tiết màn hình Quản lý người dùng (`/admin/users`)
- [ ] Xây dựng chi tiết màn hình Phân tích (`/admin/analytics`)
- [ ] Chức năng phân quyền (Role-based Guard) cho route `/admin`
- [x] Tích hợp API Upload tệp tin thực tế (Audio & Thumbnail)
- [x] Trình soạn thảo nội dung song ngữ WYSIWYG
- [x] Kéo thả sắp xếp thứ tự từ vựng (Vocabulary Drag & Drop)
- [ ] Công cụ VTT Creator (tách transcript thành phụ đề tự động)
- [ ] Áp dụng Unified Editor và Audio Upload cho các tab Mini Story, POV
