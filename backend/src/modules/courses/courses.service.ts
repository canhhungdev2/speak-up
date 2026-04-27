import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { slugify } from '../../common/utils/slugify';

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

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return course;
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

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);
    
    if (!course.slug) {
      course.slug = slugify(course.title);
    }
    
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    
    Object.assign(course, updateCourseDto);
    
    if (updateCourseDto.title && !updateCourseDto.slug) {
      course.slug = slugify(course.title);
    }
    
    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }

  async reorder(orderData: { id: string; order_index: number }[]) {
    const updatePromises = orderData.map((item) =>
      this.courseRepository.update(item.id, { order_index: item.order_index }),
    );
    return Promise.all(updatePromises);
  }
}
