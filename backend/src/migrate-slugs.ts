import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoursesService } from './modules/courses/courses.service';
import { LessonsService } from './modules/lessons/lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { slugify } from './common/utils/slugify';

async function migrate() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const courseRepo = app.get<Repository<Course>>(getRepositoryToken(Course));
  const lessonRepo = app.get<Repository<Lesson>>(getRepositoryToken(Lesson));

  console.log('Migrating Courses...');
  const courses = await courseRepo.find();
  for (const course of courses) {
    if (!course.slug) {
      course.slug = slugify(course.title);
      await courseRepo.save(course);
      console.log(`Updated course: ${course.title} -> ${course.slug}`);
    }
  }

  console.log('Migrating Lessons...');
  const lessons = await lessonRepo.find();
  for (const lesson of lessons) {
    if (!lesson.slug) {
      lesson.slug = slugify(lesson.title);
      await lessonRepo.save(lesson);
      console.log(`Updated lesson: ${lesson.title} -> ${lesson.slug}`);
    }
  }

  await app.close();
  console.log('Migration completed!');
}

migrate();
