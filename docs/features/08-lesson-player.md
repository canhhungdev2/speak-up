# Tính năng 08 — Lesson Player (Màn hình Học bài)

## Mô tả
Màn hình học bài chính, nơi học viên tương tác với nội dung bài học bao gồm bài đọc song ngữ, audio, từ vựng và các câu chuyện mini.

## Đường dẫn
- **URL**: `/learner/courses/:courseId/lessons/:lessonId` (Mock điều hướng qua lesson list)
- **File**: `frontend/src/app/features/learner/courses/lesson-player.component.ts`
- **Layout**: `LearnerLayoutComponent` (Full Sidebar)

## Các thành phần giao diện

### 1. Sidebar Nội dung (Lesson Sections)
Cho phép chuyển đổi giữa các phần khác nhau của bài học:
- **Main Article**: Bài đọc chính.
- **Vocabulary**: Giải thích từ vựng.
- **Mini Stories**: Các câu chuyện phụ liên quan.
- **Point of View**: Luyện tập ngữ pháp qua các góc nhìn thời gian khác nhau.
- **Commentary**: Bình luận thêm về bài học.

### 2. Giao diện Bài đọc Song ngữ (Bilingual Article)
Hỗ trợ hiển thị nội dung bài học chia làm 2 cột với không gian rộng rãi (`max-w-6xl`):
- **Cột trái**: Văn bản Tiếng Anh (Font **Merriweather**, đậm hơn, hiển thị các ký tự và dấu chuẩn).
- **Cột phải**: Bản dịch Tiếng Việt (Font **Merriweather**, In nghiêng, màu xám nhẹ để phân biệt).
- **Phông chữ**: Sử dụng **Merriweather** — một phông chữ Serif cao cấp hỗ trợ hiển thị tiếng Việt rất tốt, giúp các dấu thanh và dấu mũ trông tự nhiên và sắc nét hơn.
- **Responsive**: Trên mobile, nội dung hiển thị dạng danh sách (Tiếng Anh trên, Tiếng Việt dưới).

### 3. Audio Player Cao cấp
Thanh điều khiển âm thanh cố định phía dưới màn hình:
- Nút Play/Pause lớn ở giữa.
- Thanh tiến trình (Progress Bar).
- Điều chỉnh tốc độ phát (Playback Speed): 0.75x, 1x, 1.25x, 1.5x, 2x.
- Thông tin bài học đang phát.

## Dữ liệu & Lưu trữ
Để hỗ trợ hiển thị song ngữ khớp nhau từng đoạn, dữ liệu được lưu trong database dưới dạng **JSONB** trong bảng `lessons`:
- **Field**: `content_bilingual`
- **Format**: `[{ "en": "Sentence 1", "vi": "Câu 1" }, { "en": "Sentence 2", "vi": "Câu 2" }]`

Cách tiếp cận này giúp:
1. Đảm bảo bản dịch luôn khớp với bản gốc theo từng đoạn.
2. Dễ dàng mở rộng (ví dụ: thêm cột tiếng Nhật, tiếng Pháp) mà không cần đổi schema.
3. Tải dữ liệu nhanh trong một lần gọi API.

## TODO / Còn thiếu
- [ ] Tích hợp `HTML Audio Element` thật để phát file từ `audioUrl`.
- [ ] Đồng bộ thanh tiến trình với thời gian phát audio thực tế.
- [ ] Chức năng highlight từ vựng khi click vào các từ in đậm trong bài đọc.
- [ ] Lưu tiến độ hoàn thành từng phần của bài học vào database.
- [ ] Tự động chuyển phần tiếp theo khi audio kết thúc.
