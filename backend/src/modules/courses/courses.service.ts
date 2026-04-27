import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll() {
    const courses = await this.courseRepository.find({
      relations: ['lessons'],
      order: { order_index: 'ASC' },
    });

    return courses.map(course => ({
      ...course,
      lessons_count: course.lessons?.length || 0,
    }));
  }

  async findOneBySlug(slug: string) {
    const course = await this.courseRepository.findOne({
      where: { slug },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found`);
    }

    return course;
  }
}
