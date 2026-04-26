# Database Schema — SpeakUp

> ⚠️ Schema này đã được triển khai thông qua **TypeORM Entities**.

## Bảng chính (Entities)

### `User` (profiles table)
Được quản lý bởi **Supabase Auth**. Bảng `profiles` chứa thông tin bổ sung.

```typescript
@Entity('profiles')
export class User {
  @PrimaryColumn('uuid') id: string; // From Supabase Auth
  @Column() username: string;
  @Column() role: string;           // 'learner' | 'admin'
  @Column() level: number;
  @Column() xp: number;
  @Column() streak: number;
  @Column() last_active: Date;
  @CreateDateColumn() created_at: Date;
}
```

### `Course` (courses table)
```typescript
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column() description: string;
  @Column() level: string;          // 'beginner' | 'intermediate' | 'advanced'
  @Column() thumbnail: string;
  @Column() order_index: number;
  @OneToMany(() => Lesson, lesson => lesson.course) lessons: Lesson[];
}
```

### `Lesson` (lessons table)
```typescript
@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn() id: number;
  @Column() course_id: number;
  @ManyToOne(() => Course) course: Course;
  @Column() title: string;
  @Column() type: string;           // 'video' | 'audio' | 'story' | 'quiz'
  @Column() content_url: string;
  @Column() duration: number;
  @Column() order_index: number;
}
```

### `Vocabulary` (vocabulary table)
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

### `UserVocabulary` (SRS State)
```typescript
@Entity('user_vocabulary')
@Unique(['user_id', 'vocabulary_id'])
export class UserVocabulary {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: string;
  @Column() vocabulary_id: number;
  @Column() srs_level: number;      // 0-5
  @Column() ease_factor: number;    // SM-2 Factor
  @Column() interval: number;       // Days
  @Column() next_review: Date;
  @Column() last_reviewed: Date;
}
```

## Thuật toán SRS (SM-2)

Logic này được triển khai trong Service khi xử lý đánh giá từ vựng:

```typescript
// rating: 0=again, 1=hard, 2=good, 3=easy
function calculateNextReview(card: UserVocabulary, rating: number) {
  if (rating === 0) {
    return { interval: 1, easeFactor: card.ease_factor - 0.2 };
  }

  const newEase = card.ease_factor + (0.1 - (3 - rating) * 0.08);
  const newInterval = Math.ceil(card.interval * Math.max(1.3, newEase));

  return {
    interval: newInterval,
    easeFactor: Math.max(1.3, newEase)
  };
}
```
