import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity('user_progress')
@Unique(['user_id', 'lesson_id'])
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  lesson_id: number;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;
}
