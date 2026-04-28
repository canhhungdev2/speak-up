import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vocabulary } from '../../entities/vocabulary.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabularyRepository: Repository<Vocabulary>,
  ) {}

  async create(data: Partial<Vocabulary>) {
    const vocab = this.vocabularyRepository.create(data);
    return this.vocabularyRepository.save(vocab);
  }

  async update(id: string, data: Partial<Vocabulary>) {
    await this.vocabularyRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const vocab = await this.findOne(id);
    return this.vocabularyRepository.remove(vocab);
  }

  async findOne(id: string) {
    const vocab = await this.vocabularyRepository.findOneBy({ id });
    if (!vocab) throw new NotFoundException(`Vocabulary with ID "${id}" not found`);
    return vocab;
  }

  async findByLesson(lessonId: string) {
    return this.vocabularyRepository.find({
      where: { lesson_id: lessonId },
      order: { created_at: 'ASC' }
    });
  }
}
