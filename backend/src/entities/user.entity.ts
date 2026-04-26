import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('profiles')
export class User {
  @PrimaryColumn('uuid')
  id: string; // From Supabase Auth

  @Column({ nullable: true })
  username: string;

  @Column({ default: 'learner' })
  role: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  streak: number;

  @Column({ type: 'date', nullable: true })
  last_active: Date;

  @CreateDateColumn()
  created_at: Date;
}
