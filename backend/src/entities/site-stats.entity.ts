import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('site_stats')
export class SiteStats {
  @PrimaryColumn('date')
  date: string; // YYYY-MM-DD

  @Column({ default: 0 })
  visit_count: number;
}
