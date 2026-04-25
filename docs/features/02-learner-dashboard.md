# Tính năng 02 — Learner Dashboard

## Mô tả
Trang tổng quan dành cho học viên sau khi đăng nhập. Hiển thị các chỉ số học tập theo thời gian thực và cung cấp lối vào nhanh các tính năng chính.

## Đường dẫn
- **URL**: `/learner`
- **File**: `frontend/src/app/features/learner/dashboard/dashboard.component.ts`
- **Layout**: Dùng `LearnerLayoutComponent` (có Sidebar + Header)

## Các thành phần giao diện

### 1. Stats Grid (4 chỉ số SRS)
Hiển thị 4 chỉ số quan trọng với **hiệu ứng số chạy** (count-up animation, 1.5 giây, ease-out expo).

| Widget | Giá trị mẫu | Màu sắc | Liên kết |
|---|---|---|---|
| Từ đã học | 1,240 | Emerald | → `/learner/vocabulary` |
| Đến hạn ôn | 45 | Rose | — |
| Thời gian học | 45m | Amber | — |
| Độ chính xác | 92% | Indigo | — |

### 2. Streak Banner
Thẻ gradient Đỏ lớn hiển thị chuỗi ngày học liên tục. Chứa 2 nút:
- **"Tiếp tục bài học"** — chưa có liên kết
- **"Ôn tập (N từ)"** → điều hướng tới `/learner/vocabulary/study`

### 3. 7-Day Workload Forecast
Biểu đồ cột dọc dự báo số từ vựng đến hạn ôn trong 7 ngày tới.
- Click vào cột → Tooltip hiện số từ cụ thể (có thể click lại để ẩn)
- Dữ liệu: Mock, sẽ thay bằng API `/vocabulary/forecast` sau

### 4. Recent Discussions
Hiển thị 2 bài thảo luận cộng đồng mới nhất. Dữ liệu tĩnh, chưa kết nối API.

## Logic Component

```typescript
// Animated counter (count-up)
private animateCount(target: number, signalRef: WritableSignal<number>) {
  // Ease-out expo trong 1500ms
  // Gọi requestAnimationFrame mỗi frame
}

// Workload forecast
forecast = signal([
  { label: 'FRI', value: 5,  count: 12 },
  { label: 'SAT', value: 20, count: 54 },
  // ...
]);

// Toggle tooltip trên biểu đồ
selectDay(label: string) { ... }
```

## TODO / Còn thiếu
- [ ] Kết nối API thực tế để lấy `wordsLearned`, `wordsDue` của từng user
- [ ] Kết nối API `/vocabulary/forecast` cho biểu đồ 7 ngày
- [ ] Nút "Tiếp tục bài học" điều hướng đến bài học đang dở
- [ ] Dữ liệu Recent Discussions từ API diễn đàn
