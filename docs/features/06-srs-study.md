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

## Luồng học (Study Loop)

```
[Vào trang] → Tải danh sách từ đến hạn
     ↓
[Mặt trước] → Hiển thị TỪ + IPA + nút 🔊
     ↓ (Space / Click "Hiện đáp án")
[Mặt sau]  → Hiển thị NGHĨA + Câu ví dụ
     ↓
[Tự đánh giá] → Chọn 1 trong 4 mức:
  😵 Quên   → Thêm lại vào cuối queue (ôn lại ngay)
  😓 Khó    → Lên lịch ôn sau 10 phút
  😊 Tốt    → Lên lịch ôn sau 1 ngày
  😎 Dễ    → Lên lịch ôn sau 4 ngày
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

## Tính năng Âm thanh
- Nút 🔊 dùng **Web Speech API** (`SpeechSynthesisUtterance`, ngôn ngữ `en-US`)
- Không phát âm tự động khi lật thẻ (theo yêu cầu)

## Dữ liệu & SRS Logic
Hiện tại dùng **Mock Data** (5 từ hardcode). Sau khi kết nối backend:

```typescript
// Dữ liệu thật sẽ đến từ:
GET /api/vocabulary/due   // Lấy danh sách từ đến hạn ôn của user

// Sau khi đánh giá:
POST /api/vocabulary/:id/review
Body: { rating: 'good' | 'hard' | 'easy' | 'again' }
// Backend tính toán nextReviewDate theo thuật toán SM-2
```

## Animation & Cảm giác (Feel)
- [x] **Card Flip**: Hiệu ứng lật thẻ 3D mượt mà bằng CSS `transform` và `backface-visibility`.
- [x] **Transitions**: Animation chuyển thẻ (slide + fade) cực kỳ cao cấp, mang lại cảm giác mượt mà như app mobile.
- [x] **Confetti**: Hiệu ứng pháo giấy khi hoàn thành session.

## TODO / Còn thiếu
- [ ] Kết nối API thực tế để lấy từ đến hạn
- [ ] Implement thuật toán SM-2 đầy đủ ở Backend (đã có Entity)
- [ ] Thêm chế độ học Trắc nghiệm (Multiple Choice) cho từ level 2+
- [ ] Lưu trạng thái session nếu người dùng thoát giữa chừng
