# Database Schema — SpeakUp

> ⚠️ Schema này đã được triển khai thông qua **TypeORM Entities**. Toàn bộ các bảng đều hỗ trợ lưu trữ dữ liệu học tập và quản lý người dùng.

## Bảng chính (Entities)

### `User` (Bảng `profiles`)
Lưu trữ thông tin chi tiết của người học, mở rộng từ bảng `auth.users` của Supabase.
- `id`: Định danh duy nhất (UUID), khớp với ID từ Supabase Auth.
- `username`: Tên người dùng hiển thị trên hệ thống.
- `role`: Phân quyền (ví dụ: `learner` cho học viên, `admin` cho quản trị viên).
- `created_at`: Thời điểm tạo tài khoản.

```typescript
@Entity('profiles')
export class User {
  @PrimaryColumn('uuid') id: string; 
  @Column() username: string;
  @Column() role: string;           
  @CreateDateColumn() created_at: Date;
}
```

### `Course` (Bảng `courses`)
Chứa thông tin về các khóa học tiếng Anh.
- `id`: ID tự tăng của khóa học.
- `title`: Tên khóa học (ví dụ: "Real English").
- `description`: Mô tả nội dung và mục tiêu của khóa học.
- `level`: Độ khó (`beginner`, `intermediate`, `advanced`).
- `thumbnail`: Đường dẫn đến ảnh đại diện của khóa học.
- `order_index`: Thứ tự hiển thị của khóa học trong danh sách.
- `slug`: Đường dẫn thân thiện (ví dụ: `real-english`). Duy nhất và được đánh chỉ mục.

```typescript
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column() description: string;
  @Column() level: string;          
  @Column() thumbnail: string;
  @Column() order_index: number;
  @Column({ unique: true }) @Index() slug: string;
  @OneToMany(() => Lesson, lesson => lesson.course) lessons: Lesson[];
}
```

### `Lesson` (Bảng `lessons`)
Lưu trữ các bài học thuộc một khóa học. Mỗi bài học bao gồm nhiều thành phần (Main, Vocab, POV, Commentary, Mini Stories).
- `course_id`: Khóa ngoại liên kết với bảng `courses`.
- `title`: Tên bài học.
- `main_audio_url`: URL file audio bài học chính.
- `main_content_bilingual`: Dữ liệu bài đọc song ngữ (JSONB).
- `vocab_audio_url`: URL file audio phần từ vựng.
- `mini_stories`: Danh sách các câu chuyện mini (JSONB array). Mỗi item gồm `{audio_url, vtt_url, title}`.
- `pov_audio_url`, `pov_vtt_url`: Audio và phụ đề cho phần Point of View.
- `commentary_audio_url`, `commentary_vtt_url`: Audio và phụ đề cho phần Commentary.
- `order_index`: Thứ tự của bài học trong khóa học.
- `slug`: Đường dẫn thân thiện.

```typescript
@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') course_id: string;
  @Column() title: string;
  @Column() main_audio_url: string;
  @Column({ type: 'jsonb' }) main_content_bilingual: { en: string; vi: string; }[];
  @Column() vocab_audio_url: string;
  @Column({ type: 'jsonb' }) mini_stories: { audio_url: string; vtt_url: string; title?: string }[];
  @Column() pov_audio_url: string;
  @Column() pov_vtt_url: string;
  @Column() commentary_audio_url: string;
  @Column() commentary_vtt_url: string;
  @Column() order_index: number;
  @Column({ unique: true }) @Index() slug: string;
}
```

### `Vocabulary` (Bảng `vocabulary`)
Lưu trữ kho từ vựng đi kèm theo từng bài học.
- `lesson_id`: Liên kết với bài học chứa từ vựng này.
- `term`: Từ tiếng Anh.
- `ipa`: Phiên âm quốc tế.
- `definition`: Ý nghĩa tiếng Việt.
- `example`: Câu ví dụ sử dụng từ.
- `word_type`: Loại từ (`n`, `v`, `adj`, `adv`).
- `audio_url`: Đường dẫn file phát âm của từ.

```typescript
@Entity('vocabulary')
export class Vocabulary {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') lesson_id: string;
  @ManyToOne(() => Lesson) lesson: Lesson;
  @Column() term: string;
  @Column() ipa: string;
  @Column() definition: string;
  @Column() example: string;
  @Column() word_type: string;
  @Column() audio_url: string;
}
```

