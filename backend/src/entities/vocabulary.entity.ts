import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('vocabulary')
export class Vocabulary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lesson_id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.vocabularies)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column()
  term: string;

  @Column({ nullable: true })
  ipa: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ type: 'text', nullable: true })
  definition_vi: string;

  @Column({ type: 'text', nullable: true })
  example: string;

  @Column({ nullable: true })
  word_type: string;

  @Column({ nullable: true })
  audio_url: string;

  @CreateDateColumn()
  created_at: Date;
}
