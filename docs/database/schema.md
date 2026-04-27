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
  @PrimaryGeneratedColumn() id: number;
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
Lưu trữ các bài học thuộc một khóa học.
- `course_id`: Khóa ngoại liên kết với bảng `courses`.
- `title`: Tên bài học.
- `type`: Loại bài học (`video`, `audio`, `story`, `quiz`).
- `content_url`: Đường dẫn đến file media (video/audio) trên Supabase Storage.
- `content_bilingual`: Dữ liệu bài đọc song ngữ (JSONB), lưu các cặp đoạn văn Anh - Việt.
- `duration`: Thời lượng của bài học (tính bằng giây).
- `order_index`: Thứ tự của bài học trong khóa học.
- `slug`: Đường dẫn thân thiện (ví dụ: `the-turtle-story`). Duy nhất và được đánh chỉ mục.

```typescript
@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn() id: number;
  @Column() course_id: number;
  @ManyToOne(() => Course) course: Course;
  @Column() title: string;
  @Column() type: string;           
  @Column() content_url: string;
  @Column({ type: 'jsonb' }) content_bilingual: { en: string; vi: string; }[];
  @Column() duration: number;
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
  @PrimaryGeneratedColumn() id: number;
  @Column() lesson_id: number;
  @ManyToOne(() => Lesson) lesson: Lesson;
  @Column() term: string;
  @Column() ipa: string;
  @Column() definition: string;
  @Column() example: string;
  @Column() word_type: string;
  @Column() audio_url: string;
}
```

