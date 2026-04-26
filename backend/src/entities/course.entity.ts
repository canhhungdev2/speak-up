import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}
