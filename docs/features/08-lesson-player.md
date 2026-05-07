# Tính năng 08 — Lesson Player (Màn hình Học bài)

## Mô tả
Màn hình học bài chính, nơi học viên tương tác với nội dung bài học bao gồm bài đọc song ngữ, audio, từ vựng và các câu chuyện mini. Giao diện được thiết kế tối ưu cho cả desktop và mobile.

## Đường dẫn
- **URL**: `/learner/courses/:courseSlug/lessons/:lessonSlug`
- **File**: `frontend/src/app/features/learner/courses/lesson-player.component.ts`
- **Layout**: `LearnerLayoutComponent` (Slim Sidebar — sidebar thu gọn dạng icon)

## Các thành phần giao diện

### 1. Sidebar Nội dung (Lesson Sections)
Hiển thị trên **desktop** (≥ 1024px) dưới dạng sidebar bên trái. Trên **mobile**, sidebar được ẩn và thay bằng nút "Nội dung bài học" để mở menu drawer kéo từ bên trái.

Cho phép chuyển đổi giữa các phần khác nhau của bài học:
- **Main Article** 📄: Bài đọc chính song ngữ.
- **Vocabulary** 📚: Thẻ từ vựng với phát âm.
- **Mini Stories** 📖: Các câu chuyện phụ liên quan (có highlight đồng bộ VTT).
- **Point of View** 🔄: Luyện tập ngữ pháp qua các góc nhìn thời gian khác nhau.
- **Commentary** 💬: Bình luận thêm về bài học.

Các section chỉ hiển thị khi có dữ liệu (kiểm tra `audioUrl` tương ứng).

### 2. Giao diện Bài đọc Song ngữ (Bilingual Article)
Hỗ trợ hiển thị nội dung bài học chia làm 2 cột với không gian rộng rãi (`max-w-6xl`):
- **Cột trái**: Văn bản Tiếng Anh (Font **Merriweather**, đậm hơn).
- **Cột phải**: Bản dịch Tiếng Việt (Font **Merriweather**, In nghiêng, màu xám nhẹ).
- **Responsive**: Trên mobile, nội dung hiển thị dạng danh sách (Tiếng Anh trên, Tiếng Việt dưới).
- **Lọc nội dung trống**: Tự động loại bỏ các đoạn chỉ chứa khoảng trắng, `&nbsp;` hoặc thẻ HTML rỗng.

### 3. Thẻ Từ vựng (Vocabulary Cards)
Thiết kế dạng thẻ hiện đại với các thành phần:
- **Tên từ**: Màu chủ đạo (primary), font lớn, đậm.
- **Phiên âm IPA**: Hiển thị bên cạnh từ vựng, màu xám.
- **Nút Thêm vào ôn tập** ➕: Gọi `POST /vocabulary/learn` để đưa từ vào hệ thống SRS ngay lập tức.
- **Nút Phát âm** 🔊: Phát file audio riêng cho từng từ qua `playVocabAudio()`. Hoạt động độc lập với audio player chính.
- **Nghĩa tiếng Việt**: Hiển thị `translation` (ưu tiên) hoặc `definition` nếu chưa có translation.
- **Ví dụ**: Khối thụt lề với `border-left` xám để tách biệt rõ ràng.

### 3a. Vocabulary Quiz (Kiểm tra từ vựng)
Khi bài học có **≥ 4 từ vựng**, nút **"🧠 Kiểm tra từ vựng bài này"** xuất hiện ở đầu tab Vocab.
- **File**: `frontend/src/app/features/learner/courses/vocab-quiz.component.ts`
- **Loại câu hỏi**: Hiển thị **từ tiếng Anh + phiên âm IPA**, chọn **nghĩa tiếng Việt đúng** trong 4 đáp án.
- **Phím tắt**: `1-4` chọn đáp án, `Space` chuyển câu tiếp.
- **Kết quả**: Hiển thị số câu đúng/sai + emoji + nút **"Thêm vào danh sách ôn tập"**.
- **Logic SRS**: Từ đúng → rating `good`, từ sai → rating `again`. Gọi `POST /vocabulary/learn-batch` một lần.
- **UI**: Modal overlay full-screen với nền tối (`bg-[#0f172a]`), hiệu ứng confetti khi hoàn thành.

### 4. Audio Player Cao cấp
Thanh điều khiển âm thanh cố định phía dưới màn hình (position: `absolute`, z-index: `40`):
- Nút Play/Pause lớn ở giữa.
- Thanh tiến trình (Progress Bar) — click để seek.
- Điều chỉnh tốc độ phát (Playback Speed): 0.5x → 2x.
- Thông tin bài học đang phát (ẩn trên mobile nhỏ).

**Quản lý vòng đời Audio:**
- Sử dụng `Promise` cho `audio.play()` để tránh lỗi "Interrupted".
- `ngOnDestroy`: Tự động `pause()` và giải phóng `src` khi component bị hủy.
- Khi chuyển section (tab), audio cũ được dừng lại tự động.

### 5. Mobile Sidebar Overlay (Drawer)
Khi trên thiết bị di động, một nút "Nội dung bài học" xuất hiện ở đầu nội dung. Khi bấm:
- Menu drawer trượt từ bên trái với backdrop mờ (z-index: `150`).
- Hiển thị đầy đủ danh sách section giống desktop.
- Bấm vào section → chuyển nội dung + tự động đóng drawer.
- Hiển thị tiến độ bài học (% progress) ở footer drawer.

### 6. Mini Stories & Highlight đồng bộ
- **Dữ liệu**: Mỗi mini story bao gồm một file audio (`.mp3`) và một file phụ đề (`.vtt`).
- **Media Streaming**: Audio và phụ đề được truyền phát (stream) từ bộ lưu trữ ngoài qua Media API.
- **Highlight**: Ứng dụng giải mã file VTT để lấy các mốc thời gian và tự động highlight câu văn tương ứng khi audio phát đến.
- **Tương tác**: Click vào câu văn để nhảy nhanh đến đoạn âm thanh đó.

### 7. Phụ đề POV & Commentary (VTT Sync)
Phần Point of View và Commentary hỗ trợ hiển thị phụ đề đồng bộ, giống hệt Mini Stories:
- **Dữ liệu**: Sử dụng `pov_vtt_url` và `commentary_vtt_url` từ bảng `lessons`.
- **Highlight Karaoke**: Câu đang phát được tô nền (`bg-primary/20`), click vào câu để tua audio.
- **Điều kiện hiển thị**: Chỉ hiển thị khi admin đã upload file VTT. Nếu không có VTT, giao diện hiển thị bình thường (chỉ có đoạn giới thiệu).

## Xử lý Đường dẫn Media
Component sử dụng hàm `getMediaUrl()` để chuẩn hóa đường dẫn media:
- URL đầy đủ (`http://...`): Giữ nguyên.
- Đường dẫn tuyệt đối (`/media/...`): Thêm `apiBaseUrl`.
- Đường dẫn tương đối có `/`: Thêm prefix `/media/courses/{courseSlug}/lessons/{lessonSlug}/`.
- Tên file đơn giản (vd: `story1.mp3`): Tự động ánh xạ vào thư mục lessons hoặc `/media/audio/`.

## Dữ liệu & Lưu trữ
Dữ liệu song ngữ được lưu trong database dưới dạng **JSONB** trong bảng `lessons`:
- **Field**: `main_content_bilingual`
- **Format**: `[{ "en": "Sentence 1", "vi": "Câu 1" }, ...]`

## TODO / Còn thiếu
- [x] Tích hợp `HTML Audio Element` thật để phát file từ `audioUrl`.
- [x] Đồng bộ thanh tiến trình với thời gian phát audio thực tế.
- [x] Tính năng highlight đồng bộ cho Mini Story sử dụng file WebVTT.
- [x] Hệ thống Media Streaming API để phục vụ file từ bộ lưu trữ ngoài.
- [x] Quản lý vòng đời audio (pause khi chuyển tab, destroy khi rời trang).
- [x] Mobile sidebar overlay (drawer) cho phép chuyển đổi section trên điện thoại.
- [x] Phát âm từ vựng độc lập (click nút loa trên vocabulary card).
- [x] Nút "Thêm vào ôn tập" (+) kết nối `POST /vocabulary/learn`.
- [x] Vocabulary Quiz (trắc nghiệm 4 đáp án) kết nối `POST /vocabulary/learn-batch`.
- [x] Phụ đề đồng bộ (VTT Sync) cho POV và Commentary.
- [ ] Chức năng highlight từ vựng khi click vào các từ in đậm trong bài đọc.
- [ ] Lưu tiến độ hoàn thành từng phần của bài học vào database.
- [ ] Tự động chuyển phần tiếp theo khi audio kết thúc.
