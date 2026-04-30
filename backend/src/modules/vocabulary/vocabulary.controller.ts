import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from '../../entities/vocabulary.entity';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  create(@Body() data: Partial<Vocabulary>) {
    return this.vocabularyService.create(data);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.vocabularyService.findByLesson(lessonId);
  }

  @Patch('reorder')
  reorder(@Body() orderData: { id: string, order_index: number }[]) {
    return this.vocabularyService.reorder(orderData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Vocabulary>) {
    return this.vocabularyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }
}
