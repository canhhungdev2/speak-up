# Database Schema — SpeakUp

> ⚠️ Schema này là thiết kế dự kiến. Cần tạo migration trên Supabase/Prisma trước khi sử dụng.

## Bảng chính

### `users`
Được quản lý bởi **Supabase Auth**. Bảng `profiles` extend thêm thông tin.

```sql
-- Tự động tạo bởi Supabase Auth
auth.users (
  id          uuid PRIMARY KEY,
  email       text UNIQUE,
  created_at  timestamptz
)

-- Custom profile table
profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  username    text,
  role        text DEFAULT 'learner',  -- 'learner' | 'admin'
  level       int  DEFAULT 1,
  xp          int  DEFAULT 0,
  streak      int  DEFAULT 0,
  last_active date,
  created_at  timestamptz DEFAULT now()
)
```

### `courses`
```sql
courses (
  id          serial PRIMARY KEY,
  title       text NOT NULL,
  description text,
  level       text,          -- 'beginner' | 'intermediate' | 'advanced'
  thumbnail   text,          -- URL ảnh
  order_index int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)
```

### `lessons`
```sql
lessons (
  id          serial PRIMARY KEY,
  course_id   int REFERENCES courses(id),
  title       text NOT NULL,
  type        text,          -- 'video' | 'audio' | 'story' | 'quiz'
  content_url text,          -- URL video/audio
  duration    int,           -- Thời lượng (giây)
  order_index int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
)
```

### `vocabulary`
```sql
vocabulary (
  id          serial PRIMARY KEY,
  lesson_id   int REFERENCES lessons(id),
  term        text NOT NULL,        -- Từ tiếng Anh
  ipa         text,                 -- Phiên âm
  definition  text NOT NULL,        -- Nghĩa tiếng Việt
  example     text,                 -- Câu ví dụ
  word_type   text,                 -- 'n.' | 'v.' | 'adj.' | 'adv.'
  audio_url   text,                 -- URL file âm thanh
  created_at  timestamptz DEFAULT now()
)
```

### `user_vocabulary` (SRS State)
```sql
user_vocabulary (
  id              serial PRIMARY KEY,
  user_id         uuid REFERENCES auth.users(id),
  vocabulary_id   int  REFERENCES vocabulary(id),
  srs_level       int  DEFAULT 0,       -- 0-5
  ease_factor     float DEFAULT 2.5,    -- Hệ số SM-2
  interval        int  DEFAULT 1,       -- Số ngày đến lần ôn tiếp
  next_review     date DEFAULT now(),   -- Ngày ôn tiếp theo
  last_reviewed   timestamptz,
  UNIQUE(user_id, vocabulary_id)
)
```

### `user_progress`
```sql
user_progress (
  id          serial PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id),
  lesson_id   int  REFERENCES lessons(id),
  completed   boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
)
```

## Thuật toán SRS (SM-2 đơn giản)

Sau mỗi lần đánh giá, Backend tính lại `interval` và `next_review`:

```typescript
// rating: 0=again, 1=hard, 2=good, 3=easy
function calculateNextReview(card: UserVocabulary, rating: number) {
  if (rating === 0) {
    // Quên: ôn lại từ đầu
    return { interval: 1, easeFactor: card.easeFactor - 0.2 };
  }

  const newEase = card.easeFactor + (0.1 - (3 - rating) * 0.08);
  const newInterval = Math.ceil(card.interval * Math.max(1.3, newEase));

  return {
    interval: newInterval,
    easeFactor: Math.max(1.3, newEase)
  };
}
```
