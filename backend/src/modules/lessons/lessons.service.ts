import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async findOneBySlug(courseSlug: string, lessonSlug: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { 
        slug: lessonSlug,
        course: { slug: courseSlug }
      },
      relations: ['course', 'vocabularies'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with slug "${lessonSlug}" in course "${courseSlug}" not found`);
    }

    return lesson;
  }
}
