import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Vocabulary } from './vocabulary.entity';

@Entity('user_vocabulary')
@Unique(['user_id', 'vocabulary_id'])
export class UserVocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  vocabulary_id: number;

  @ManyToOne(() => Vocabulary)
  @JoinColumn({ name: 'vocabulary_id' })
  vocabulary: Vocabulary;

  @Column({ default: 0 })
  srs_level: number;

  @Column('float', { default: 2.5 })
  ease_factor: number;

  @Column({ default: 1 })
  interval: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  next_review: Date;

  @Column({ type: 'timestamptz', nullable: true })
  last_reviewed: Date;
}
