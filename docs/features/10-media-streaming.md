# Tính năng 10 — Media Streaming (Truyền phát Media)

## Mô tả
Hệ thống cho phép lưu trữ và phục vụ các file media (âm thanh, hình ảnh, phụ đề) từ một thư mục bên ngoài dự án. Điều này giúp giảm tải cho mã nguồn và cho phép quản lý nội dung độc lập.

## Kiến trúc

### 1. Kho lưu trữ (External Storage)
- **Đường dẫn mặc định**: `E:\Workspace\MyProject\Storage\speak-up-storage` (cấu hình qua `STORAGE_PATH`)
- **Cấu trúc thư mục**:
  ```
  speak-up-storage/
  ├── courses/
  │   └── {course-slug}/
  │       ├── thumbnail.{ext}              # Ảnh khóa học
  │       └── lessons/
  │           └── {lesson-slug}/
  │               ├── MainArticle.mp3      # Audio bài chính
  │               ├── Vocabulary.mp3       # Audio từ vựng
  │               ├── ms1.mp3, ms2.mp3     # Audio mini stories
  │               └── ms1.vtt, ms2.vtt     # Phụ đề mini stories
  ├── audio/                                # Legacy: file audio cũ
  └── vtt/                                  # Legacy: file phụ đề cũ
  ```

### 2. Backend (Media API)
Backend đóng vai trò là một proxy bảo mật để truyền phát dữ liệu file.

| Endpoint | Chức năng |
|----------|-----------|
| `GET /media/courses/:slug/thumbnail/:filename` | Phục vụ ảnh thumbnail khóa học |
| `GET /media/courses/:courseSlug/lessons/:lessonSlug/:filename` | Phục vụ media bài học |
| `GET /media/:type/:filename` | Legacy — phục vụ `/media/audio/xxx.mp3`, `/media/vtt/xxx.vtt` |
| `POST /media/upload/course-thumbnail/:courseSlug` | Upload ảnh thumbnail (tên cố định `thumbnail.{ext}`) |
| `POST /media/upload/lesson-media/:courseSlug/:lessonSlug` | Upload audio/media bài học |

- **Cơ chế**: Sử dụng `res.sendFile()` để phục vụ file từ kho lưu trữ ngoài.
- **MIME Types**: Tự động xác định kiểu tệp:
  - `.mp3` → `audio/mpeg`, `.wav` → `audio/wav`
  - `.vtt` → `text/vtt`
  - `.jpg/.jpeg` → `image/jpeg`, `.png` → `image/png`, `.webp` → `image/webp`
  - `.svg` → `image/svg+xml`, `.gif` → `image/gif`

### 3. Frontend — MediaUrlPipe
**File**: `frontend/src/app/shared/pipes/media-url.pipe.ts`

Pipe dùng trong template để chuyển đổi đường dẫn media thành URL đầy đủ. Hỗ trợ nhiều format đầu vào:

| Đầu vào | Xử lý | Kết quả |
|----------|--------|---------|
| `http://...` | Giữ nguyên | `http://...` |
| `{"url": "/media/..."}` | Parse JSON, lấy `.url` | `http://localhost:3000/media/...` |
| `/media/courses/...` | Thêm `apiBaseUrl` | `http://localhost:3000/media/courses/...` |
| `courses/slug/file.png` | Thêm `/media/` prefix | `http://localhost:3000/media/courses/slug/file.png` |
| `story1.mp3` | Thêm `/media/audio/` prefix | `http://localhost:3000/media/audio/story1.mp3` |

**Xử lý đặc biệt:**
- **Chuẩn hóa Windows path**: Tự động chuyển dấu `\` thành `/`.
- **Parse JSON an toàn**: Nếu giá trị là JSON string (lỗi lưu trữ cũ), tự động trích xuất `url` bên trong.

### 4. Frontend — MediaService
**File**: `frontend/src/app/core/services/media.service.ts`
- `getMediaUrl()`: Xây dựng URL đầy đủ đến API backend.
- `fetchAndParseVtt()`: Tải file VTT và chuyển đổi sang dữ liệu ứng dụng thông qua `vtt-parser` utility.

## Cách cấu hình
1. Đảm bảo thư mục lưu trữ tồn tại trên ổ đĩa.
2. Cấu hình biến môi trường `STORAGE_PATH` trong file `.env` của Backend.
3. Đảm bảo CORS được bật ở Backend để cho phép Frontend truy cập.

## Quy trình tạo nội dung mới
1. **Qua Admin Panel** (khuyên dùng):
   - Upload ảnh thumbnail qua trang Chỉnh sửa khóa học.
   - Upload audio qua các tab trong trang Chỉnh sửa bài học.
   - Hệ thống tự động đặt tên file chuẩn hóa.
2. **Thủ công**:
   - Copy file vào đúng thư mục trong kho lưu trữ.
   - Cập nhật đường dẫn file trong database.
