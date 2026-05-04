import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from '../../entities/vocabulary.entity';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('vocabulary')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

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
