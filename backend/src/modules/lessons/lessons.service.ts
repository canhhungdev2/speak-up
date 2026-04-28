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

  async findAllByCourse(courseId: string) {
    return this.lessonRepository.find({
      where: { course_id: courseId },
      order: { order_index: 'ASC' },
      relations: ['vocabularies'],
    });
  }

  async findOne(id: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'vocabularies'],
    });
    if (!lesson) throw new NotFoundException(`Lesson with ID "${id}" not found`);
    return lesson;
  }

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

  async create(data: Partial<Lesson>) {
    const lesson = this.lessonRepository.create(data);
    return this.lessonRepository.save(lesson);
  }

  async update(id: string, data: Partial<Lesson>) {
    await this.lessonRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const lesson = await this.findOne(id);
    return this.lessonRepository.remove(lesson);
  }

  async reorder(orderData: { id: string, order_index: number }[]) {
    const promises = orderData.map(item => 
      this.lessonRepository.update(item.id, { order_index: item.order_index })
    );
    return Promise.all(promises);
  }
}
