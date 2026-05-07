import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Vocabulary } from './vocabulary.entity';

@Entity('user_vocabulary_progress')
@Unique(['user_id', 'vocabulary_id'])
export class UserVocabularyProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  vocabulary_id: string;

  @ManyToOne(() => Vocabulary)
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @Column({ default: 'learning' })
  status: string; // 'learning', 'mastered'

  @Column({ default: 0 })
  interval: number; // in days

  @Column({ type: 'float', default: 2.5 })
  ease_factor: number;

  @Column({ default: 0 })
  repetitions: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  next_review_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  last_reviewed_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
