import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  title: string;

  @Column({ nullable: true })
  type: string; // 'video' | 'audio' | 'story' | 'quiz'

  @Column({ nullable: true })
  content_url: string;

  @Column({ type: 'jsonb', nullable: true })
  content_bilingual: { en: string; vi: string; }[];

  @Column({ nullable: true })
  duration: number;

  @Column({ default: 0 })
  order_index: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Vocabulary, (vocab) => vocab.lesson)
  vocabularies: Vocabulary[];
}
