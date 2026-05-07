import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteStats } from '../../entities/site-stats.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(SiteStats)
    private readonly statsRepository: Repository<SiteStats>,
  ) {}

  async trackVisit() {
    const today = new Date().toISOString().split('T')[0];
    
    // PostgreSQL UPSERT with increment
    return this.statsRepository.query(`
      INSERT INTO site_stats (date, visit_count)
      VALUES ($1, 1)
      ON CONFLICT (date) 
      DO UPDATE SET visit_count = site_stats.visit_count + 1
    `, [today]);
  }

  async getRecentStats(limit: number = 30) {
    return this.statsRepository.find({
      order: { date: 'DESC' },
      take: limit
    });
  }
}
