# Tính năng 05 — My Vocabulary (Quản lý Từ vựng)

## Mô tả
Trang quản lý kho từ vựng cá nhân của học viên. Hiển thị toàn bộ từ vựng đã học, độ thông thạo và cho phép bắt đầu phiên ôn tập.

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
Có **hiệu ứng số chạy** khi tải trang.

| Chỉ số | Màu | Giá trị mẫu |
|---|---|---|
| Đã thuộc | Emerald | 850 |
| Đang học | Amber | 320 |
| Đến hạn ôn | Rose | 45 |
| Mới nạp | Indigo | 12 |

### 3. Bảng từ vựng
Cột:
- **Từ vựng** (term) — Click hover đổi màu primary
- **Nghĩa / Giải thích** (definition)
- **Độ thông thạo** — 5 vạch màu, filled = level của từ
- **Thao tác** — Nút chỉnh sửa (chưa có chức năng)

## Mức độ thông thạo (SRS Level)
| Level | Ý nghĩa | Màu vạch |
|---|---|---|
| 0 | Chưa học | Xám |
| 1-2 | Đang học | Primary |
| 3-4 | Gần thuộc | Primary |
| 5 | Đã thuộc | Primary |

## TODO / Còn thiếu
- [ ] Kết nối API `GET /vocabulary` lấy từ vựng thật của user
- [ ] Logic lọc/tìm kiếm từ vựng theo thanh search
- [ ] Modal thêm từ vựng mới (tích hợp dịch tự động?)
- [ ] Trang chi tiết từ vựng (click vào từ)
- [ ] Phân trang (pagination) khi có nhiều từ
- [ ] Sắp xếp theo level, ngày thêm, alphabet
