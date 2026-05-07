import { Controller, Post, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track-visit')
  trackVisit() {
    return this.analyticsService.trackVisit();
  }

  @Get('stats')
  getStats(@Query('limit') limit: number) {
    return this.analyticsService.getRecentStats(limit);
  }
}
