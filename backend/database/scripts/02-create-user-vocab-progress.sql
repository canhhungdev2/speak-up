-- File: 02-create-user-vocab-progress.sql
-- Mô tả: Tạo bảng lưu tiến độ học từ vựng (SRS) của người dùng.

CREATE TABLE IF NOT EXISTS public.user_vocabulary_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'learning', -- 'learning', 'mastered'
    interval INTEGER DEFAULT 0, -- Số ngày chờ đến lần ôn tập tiếp theo
    ease_factor FLOAT DEFAULT 2.5, -- Hệ số nhân độ dễ
    repetitions INTEGER DEFAULT 0, -- Số lần nhớ liên tiếp
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vocabulary_id)
);

-- Index để tìm kiếm nhanh từ đến hạn ôn tập
CREATE INDEX IF NOT EXISTS idx_user_vocab_next_review ON public.user_vocabulary_progress(user_id, next_review_at);

-- Bật RLS
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_vocabulary_progress;
CREATE POLICY "Users can view own progress" ON public.user_vocabulary_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_vocabulary_progress;
CREATE POLICY "Users can insert own progress" ON public.user_vocabulary_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_vocabulary_progress;
CREATE POLICY "Users can update own progress" ON public.user_vocabulary_progress
    FOR UPDATE USING (auth.uid() = user_id);
