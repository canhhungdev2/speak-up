import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from '../../entities/vocabulary.entity';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('vocabulary')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('due')
  findDue(@Req() req: any) {
    return this.vocabularyService.findDueByUserId(req.user.sub);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.vocabularyService.getStats(req.user.sub);
  }

  @Post('review')
  updateProgress(@Req() req: any, @Body() data: { vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy' }) {
    return this.vocabularyService.updateSRSProgress(req.user.sub, data.vocabId, data.rating);
  }

  @Post('learn')
  learn(@Req() req: any, @Body() data: { vocabId: string }) {
    return this.vocabularyService.learn(req.user.sub, data.vocabId);
  }

  @Post('learn-batch')
  learnBatch(@Req() req: any, @Body() data: { items: { vocabId: string; rating: 'again' | 'hard' | 'good' | 'easy' }[] }) {
    return this.vocabularyService.learnBatch(req.user.sub, data.items);
  }

  @Post()
  @Roles('admin')
  create(@Body() data: Partial<Vocabulary>) {
    return this.vocabularyService.create(data);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.vocabularyService.findByLesson(lessonId);
  }

  @Patch('reorder')
  @Roles('admin')
  reorder(@Body() orderData: { id: string, order_index: number }[]) {
    return this.vocabularyService.reorder(orderData);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: Partial<Vocabulary>) {
    return this.vocabularyService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }
}
