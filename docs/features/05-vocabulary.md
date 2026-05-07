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

### 2. Stats Bar (4 chỉ số)
Có **hiệu ứng số chạy** khi tải trang. Dữ liệu được lấy từ API `GET /vocabulary/stats`.

| Chỉ số | Màu | Nguồn dữ liệu |
|---|---|---|
| Đã thuộc | Emerald | `stats.mastered` — Từ có `interval > 30 ngày` |
| Đang học | Amber | `stats.learning` — Từ đang trong quy trình SRS |
| Đến hạn ôn | Rose | `stats.due` — Từ có `next_review_at <= NOW()` |
| Mới nạp | Indigo | (Chưa kết nối) |

### 3. Bảng từ vựng
Cột:
- **Từ vựng** (term) — Click hover đổi màu primary
- **Nghĩa / Giải thích** (definition)
- **Độ thông thạo** — 5 vạch màu, filled = level của từ
- **Thao tác** — Nút chỉnh sửa (chưa có chức năng)

## Kết nối Backend
- `VocabularyService.getStats()` → `GET /vocabulary/stats`
- Thống kê được tải khi component khởi tạo (`ngOnInit`)

## TODO / Còn thiếu
- [x] Kết nối API `GET /vocabulary/stats` lấy thống kê thật
- [ ] Kết nối API lấy danh sách từ vựng theo tiến độ SRS
- [ ] Logic lọc/tìm kiếm từ vựng theo thanh search
- [ ] Modal thêm từ vựng mới (tích hợp dịch tự động?)
- [ ] Phân trang (pagination) khi có nhiều từ
- [ ] Sắp xếp theo level, ngày thêm, alphabet
