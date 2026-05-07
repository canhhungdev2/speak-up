import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from '../../entities/vocabulary.entity';
import { UserVocabularyProgress } from '../../entities/user-vocabulary-progress.entity';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, UserVocabularyProgress])],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
