# Tính năng 06 — SRS Study (Ôn tập Từ vựng)

## Mô tả
Màn hình ôn tập từ vựng theo hệ thống lặp lại ngắt quãng (**Spaced Repetition System — SRS**). Người học tự đánh giá mức độ ghi nhớ của mình, hệ thống sẽ lên lịch ôn tập tiếp theo dựa trên kết quả.

## Đường dẫn
- **URL**: `/learner/vocabulary/study`
- **File**: `frontend/src/app/features/learner/vocabulary/study.component.ts`
- **Layout**: **Full-screen** (không dùng LearnerLayoutComponent)

## Điểm vào (Entry Points)
1. Dashboard → Nút **"Ôn tập (N từ)"** trong Streak Banner
2. My Vocabulary → Nút **"Ôn tập"** màu đỏ góc header

## Kết nối Backend (Đã triển khai ✅)
Dữ liệu được lấy từ API thật:

```typescript
// Tải danh sách từ đến hạn ôn tập
GET /vocabulary/due
// → Trả về UserVocabularyProgress[] kèm relation vocabulary

// Cập nhật tiến độ sau khi đánh giá
POST /vocabulary/review
Body: { vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy' }
// → Backend tính toán nextReviewDate theo thuật toán SM-2
```

## Thuật toán SM-2

Sau mỗi lần đánh giá, hệ thống tính `interval` (số ngày chờ) và `ease_factor` (hệ số nhân):

| Rating | Lần đầu | Lần kế tiếp | Ease Factor |
|---|---|---|---|
| 😵 Quên (Again) | 0 ngày (xem lại ngay) | Reset interval = 0 | Giảm 0.2 (min 1.3) |
| 😓 Khó (Hard) | 1 ngày | interval × 1.2 | Giảm 0.15 (min 1.3) |
| 😊 Tốt (Good) | 1 → 3 ngày | interval × ease_factor | Không đổi |
| 😎 Dễ (Easy) | 4 ngày | interval × ease_factor × 1.3 | Tăng 0.15 (max 5.0) |

Khi `interval > 30 ngày`, từ được đánh dấu status `mastered`.

## Luồng học (Study Loop)

```
[Vào trang] → Loading spinner
     ↓
[Tải từ API] → GET /vocabulary/due
     ↓ (Có từ)          ↓ (Không có từ)
[Mặt trước]        [Màn hình "Hoàn thành hết 🎯"]
     ↓ (Space)
[Mặt sau]
     ↓
[Tự đánh giá] → POST /vocabulary/review → Lưu DB
     ↓ (Còn từ)
[Từ tiếp theo] ...
     ↓ (Hết từ)
[Màn hình Kết quả]
```

## Màn hình Kết quả
- Hiệu ứng confetti
- Tổng số từ ôn tập
- Độ chính xác (Tốt + Dễ / Tổng)
- XP nhận được (Tốt × 10 + Khó × 5)
- Biểu đồ phân bổ kết quả SRS
- Nút: **"Về trang chủ"** | **"Ôn tập tiếp"**

## Keyboard Shortcuts
| Phím | Hành động |
|---|---|
| `Space` | Lật thẻ / Hiện đáp án |
| `1` | Đánh giá: Quên |
| `2` | Đánh giá: Khó |
| `3` | Đánh giá: Tốt |
| `4` | Đánh giá: Dễ |
| `Esc` (nút ✕) | Thoát về Dashboard |

## Xử lý lỗi & Loading
- Khi đang gọi API đánh giá, nút bấm bị khóa (`isLoading` signal)
- Nếu API lỗi, hiệu ứng rung (shake) thông báo cho người dùng
- Nếu không có từ nào đến hạn, hiển thị giao diện trống thân thiện

## TODO / Còn thiếu
- [x] Kết nối API thực tế để lấy từ đến hạn
- [x] Implement thuật toán SM-2 đầy đủ ở Backend
- [x] Xử lý trạng thái loading, empty, error
- [ ] Lưu trạng thái session nếu người dùng thoát giữa chừng
- [ ] Phát âm tự động bằng file audio thay vì Web Speech API
