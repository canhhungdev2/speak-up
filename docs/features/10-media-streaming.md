# Tính năng 10 — Media Streaming (Truyền phát Media)

## Mô tả
Hệ thống cho phép lưu trữ và phục vụ các file media (âm thanh, phụ đề) từ một thư mục bên ngoài dự án. Điều này giúp giảm tải cho mã nguồn và cho phép quản lý nội dung độc lập.

## Kiến trúc

### 1. Kho lưu trữ (External Storage)
- **Đường dẫn mặc định**: `E:\Workspace\MyProject\Storage\speak-up-storage`
- **Cấu trúc thư mục**:
  - `/audio`: Chứa các file `.mp3`, `.wav`.
  - `/vtt`: Chứa các file phụ đề `.vtt`.

### 2. Backend (Media API)
Backend đóng vai trò là một proxy bảo mật để truyền phát dữ liệu file.
- **Endpoint**: `GET /media/:type/:filename`
- **Cơ chế**: Sử dụng `StreamableFile` của NestJS để đọc và truyền dữ liệu theo luồng (streaming), giúp tối ưu bộ nhớ.
- **MIME Types**: Tự động xác định kiểu tệp (ví dụ: `audio/mpeg` cho mp3, `text/vtt` cho vtt).

### 3. Frontend (Media Service)
- **Service**: `MediaService` (`frontend/src/app/core/services/media.service.ts`)
- **Chức năng**:
  - `getMediaUrl`: Xây dựng URL đầy đủ đến API backend.
  - `fetchAndParseVtt`: Tải file VTT và chuyển đổi sang dữ liệu ứng dụng thông qua `vtt-parser` utility.

## Cách cấu hình
1. Đảm bảo thư mục lưu trữ tồn tại trên ổ đĩa.
2. Cấu hình biến môi trường `STORAGE_PATH` trong file `.env` của Backend.
3. Đảm bảo CORS được bật ở Backend để cho phép Frontend truy cập.

## Quy trình tạo nội dung mới
1. Chuẩn bị file âm thanh (`.mp3`).
2. Sử dụng công cụ (như Whisper) để tạo file phụ đề WebVTT (`.vtt`).
3. Copy file vào đúng thư mục `/audio` và `/vtt` trong kho lưu trữ.
4. Cập nhật đường dẫn file trong database của bài học.
