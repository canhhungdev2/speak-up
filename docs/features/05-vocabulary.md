# Tính năng 05 — My Vocabulary (Quản lý Từ vựng)

## Mô tả
Trang quản lý kho từ vựng cá nhân của học viên. Hiển thị thống kê từ vựng thực tế từ hệ thống SRS, cho phép bắt đầu phiên ôn tập.

## Đường dẫn
- **URL**: `/learner/vocabulary`
- **File**: `frontend/src/app/features/learner/vocabulary/vocabulary-list.component.ts`
- **Layout**: Dùng `LearnerLayoutComponent`

## Thành phần giao diện

### 1. Header
- Tiêu đề + mô tả
- Thanh tìm kiếm từ (chưa có logic lọc)
- Nút **"Ôn tập"** → điều hướng `/learner/vocabulary/study`
- Nút **"+ Thêm từ"** (chưa có chức năng)

### 2. Stats Bar (4 chỉ số thực tế)
Dữ liệu được lấy từ API `GET /vocabulary/stats` với logic phân loại mới:

| Chỉ số | Màu | Định nghĩa logic |
|---|---|---|
| **Đã thuộc** | Emerald | `status = 'mastered'` (Interval > 30 ngày) |
| **Đang học** | Amber | `status = 'learning'` (Tổng số từ chưa đạt mastered) |
| **Đến hạn ôn** | Rose | `next_review_at <= NOW()` (Cần ôn tập ngay) |
| **Mới nạp** | Indigo | `created_at >= Bắt đầu ngày hôm nay` (Số từ mới thêm hôm nay) |

### 3. Bảng từ vựng (Danh sách SRS)
Dữ liệu được tải thực tế từ API `GET /vocabulary/all`.

| Cột | Mô tả logic |
|---|---|
| **Từ vựng** | Hiển thị `term` (đậm) và `ipa` (nhỏ bên dưới). |
| **Nghĩa** | Hiển thị `translation` (tiếng Việt), nếu không có sẽ dùng `definition` (tiếng Anh). |
| **Độ thông thạo** | **5 vạch màu**, được tính dựa trên `interval` (khoảng cách ôn tập):<br>- **5 vạch (Mastered)**: interval >= 21 ngày<br>- **4 vạch (High)**: interval >= 10 ngày<br>- **3 vạch (Medium)**: interval >= 4 ngày<br>- **2 vạch (Low)**: interval >= 1 ngày<br>- **1 vạch (New)**: interval < 1 ngày |
| **Thao tác** | - **Loa**: Phát âm thanh (Audio URL hoặc Web Speech API).<br>- **Xóa**: Gỡ từ khỏi lộ trình SRS (`DELETE /vocabulary/progress/:id`). |

### 4. Chi tiết các mức độ Thông thạo

| Mức độ | Số vạch | Tên gọi | Ý nghĩa logic |
|---|---|---|---|
| **Mức 1** | 1/5 | **Mới nạp / Quên** | Interval < 1 ngày. Cần ôn tập hàng ngày. |
| **Mức 2** | 2/5 | **Bắt đầu nhớ** | Interval từ 1 - 3 ngày. Ghi nhớ ngắn hạn. |
| **Mức 3** | 3/5 | **Nhớ trung hạn** | Interval từ 4 - 9 ngày. Đã nhớ được khoảng 1 tuần. |
| **Mức 4** | 4/5 | **Nhớ khá tốt** | Interval từ 10 - 20 ngày. Ghi nhớ khá ổn định. |
| **Mức 5** | 5/5 | **Đã thuộc lòng** | Interval >= 21 ngày. Đã đi vào bộ nhớ dài hạn. |

## Kết nối Backend
- `VocabularyService.getStats()` → `GET /vocabulary/stats`
- `VocabularyService.getAllProgress()` → `GET /vocabulary/all`
- `VocabularyService.deleteProgress(id)` → `DELETE /vocabulary/progress/:id`

## TODO / Còn thiếu
- [x] Kết nối API `GET /vocabulary/stats` lấy thống kê thật
- [x] Kết nối API lấy danh sách từ vựng theo tiến độ SRS
- [x] Logic lọc/tìm kiếm từ vựng theo thanh search
- [ ] Modal thêm từ vựng mới (tích hợp dịch tự động?)
- [ ] Phân trang (pagination) khi có nhiều từ
- [ ] Sắp xếp theo level, ngày thêm, alphabet
