import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { slugify } from '../common/utils/slugify';
import { Course } from './course.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  course_id: string;

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

  @Column({ unique: true })
  @Index()
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title) {
      this.slug = slugify(this.title);
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Vocabulary, (vocab) => vocab.lesson)
  vocabularies: Vocabulary[];
}
