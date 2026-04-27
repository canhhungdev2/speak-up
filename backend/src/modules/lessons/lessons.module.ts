import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from '../../entities/lesson.entity';
import { Vocabulary } from '../../entities/vocabulary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Vocabulary])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
