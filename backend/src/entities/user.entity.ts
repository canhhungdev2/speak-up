import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('profiles')
export class User {
  @PrimaryColumn('uuid')
  id: string; // From Supabase Auth

  @Column({ nullable: true })
  username: string;

  @Column({ default: 'learner' })
  role: string;

  @CreateDateColumn()
  created_at: Date;
}
