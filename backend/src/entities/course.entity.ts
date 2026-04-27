import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { slugify } from '../common/utils/slugify';
import { Lesson } from './lesson.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  level: string; // 'beginner' | 'intermediate' | 'advanced'

  @Column({ nullable: true })
  thumbnail: string;

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

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}
