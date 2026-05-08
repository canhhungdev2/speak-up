-- File: 05-add-streak-and-goal-to-profiles.sql
-- Mô tả: Thêm các cột theo dõi chuỗi ngày học và mục tiêu hàng ngày vào bảng profiles.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE,
ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 10;

-- Cập nhật comment để giải thích ý nghĩa các cột
COMMENT ON COLUMN public.profiles.current_streak IS 'Chuỗi ngày học liên tục';
COMMENT ON COLUMN public.profiles.last_activity_date IS 'Ngày cuối cùng người dùng có hoạt động học tập';
COMMENT ON COLUMN public.profiles.daily_goal IS 'Mục tiêu số từ mới cần học mỗi ngày';
