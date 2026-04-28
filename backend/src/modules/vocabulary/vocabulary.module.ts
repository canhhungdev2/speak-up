import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from '../../entities/vocabulary.entity';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary])],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
