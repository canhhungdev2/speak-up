import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Course } from './course.entity';
import { Vocabulary } from './vocabulary.entity';
import { slugify } from '../common/utils/slugify';

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

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ default: 0 })
  order_index: number;

  // --- Main Article ---
  @Column({ nullable: true })
  main_audio_url: string;

  @Column({ type: 'jsonb', nullable: true })
  main_content_bilingual: { en: string; vi: string }[];

  // --- Vocabulary ---
  @Column({ nullable: true })
  vocab_audio_url: string;

  @OneToMany(() => Vocabulary, (v) => v.lesson)
  vocabularies: Vocabulary[];

  // --- Mini Stories ---
  @Column({ type: 'jsonb', nullable: true })
  mini_stories: { 
    id: string;
    audio_url: string; 
    vtt_url: string; 
    title?: string;
    order_index?: number;
  }[];

  // --- Point Of View ---
  @Column({ nullable: true })
  pov_audio_url: string;

  @Column({ nullable: true })
  pov_vtt_url: string;

  // --- Commentary ---
  @Column({ nullable: true })
  commentary_audio_url: string;

  @Column({ nullable: true })
  commentary_vtt_url: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.title) {
      this.slug = slugify(this.title);
    }
  }

  @CreateDateColumn()
  created_at: Date;
}
