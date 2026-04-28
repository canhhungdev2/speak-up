import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Vocabulary } from './entities/vocabulary.entity';
import { Repository } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const courseRepo = app.get<Repository<Course>>(getRepositoryToken(Course));
  const lessonRepo = app.get<Repository<Lesson>>(getRepositoryToken(Lesson));
  const vocabRepo = app.get<Repository<Vocabulary>>(getRepositoryToken(Vocabulary));

  console.log('Cleaning old data...');
  await vocabRepo.query('TRUNCATE TABLE "vocabulary" CASCADE');
  await vocabRepo.query('TRUNCATE TABLE "lessons" CASCADE');
  await vocabRepo.query('TRUNCATE TABLE "courses" CASCADE');

  console.log('Seeding Courses...');
  const courses = [
    {
      title: 'Original English',
      description: 'Học cách phản xạ tiếng Anh tự nhiên qua câu chuyện thú vị về lễ hội người chết tại Mexico.',
      level: 'Cơ bản',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
      order_index: 1,
    },
    {
      title: 'Real English',
      description: 'Làm chủ các âm cơ bản và quy tắc nhấn trọng âm để nói tiếng Anh tự nhiên như người bản xứ.',
      level: 'Mọi cấp độ',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
      order_index: 2,
    },
    {
      title: 'Flow English',
      description: 'Học cách viết email, thuyết trình và thảo luận trong môi trường làm việc chuyên nghiệp.',
      level: 'Trung cấp',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      order_index: 3,
    }
  ];

  const savedCourses: Course[] = [];
  for (const c of courses) {
    const course = courseRepo.create(c);
    const saved = await courseRepo.save(course);
    savedCourses.push(saved);
    console.log(`Created course: ${saved.title} (slug: ${saved.slug})`);
  }

  console.log('Seeding Lessons for "Original English"...');
  const originalEnglish = savedCourses[0];
  const lessons = [
    {
      course_id: originalEnglish.id,
      title: 'Day Of The Dead',
      order_index: 1,
      main_audio_url: 'story1.mp3',
      main_content_bilingual: [
        { en: 'I arrive in Guatemala on The Day of the Dead, November 1st.', vi: 'Tôi đến Guatemala vào Ngày lễ người chết, ngày 1 tháng 11.' },
        { en: 'I am curious about this holiday, so I go to the cemetery to see what\'s happening.', vi: 'Tôi tò mò về ngày lễ này, vì vậy tôi đi đến nghĩa trang để xem điều gì đang xảy ra.' },
        { en: 'What I find is quite interesting. The atmosphere is like a party.', vi: 'Những gì tôi thấy khá thú vị. Không khí giống như một bữa tiệc.' }
      ],
      vocab_audio_url: 'vocab.mp3',
      mini_stories: [
        { id: 'ms1', title: 'Mini Story 1', audio_url: 'ms1.mp3', vtt_url: 'ms1.vtt' },
        { id: 'ms2', title: 'Mini Story 2', audio_url: 'ms2.mp3', vtt_url: 'ms2.vtt' }
      ],
      pov_audio_url: 'pov.mp3',
      pov_vtt_url: 'pov.vtt',
      commentary_audio_url: 'commentary.mp3',
      commentary_vtt_url: 'commentary.vtt'
    },
    {
      course_id: originalEnglish.id,
      title: 'A Kiss',
      order_index: 2,
      main_audio_url: 'story2.mp3',
      main_content_bilingual: [
        { en: 'Carlos buys a new car. It\'s a very expensive car.', vi: 'Carlos mua một chiếc xe hơi mới. Đó là một chiếc xe rất đắt tiền.' }
      ]
    },
    {
      course_id: originalEnglish.id,
      title: 'The Weaver of Stars',
      order_index: 3,
      main_audio_url: 'story3.mp3',
      main_content_bilingual: [
        { en: 'Once upon a time, there lived a young weaver named Elara.', vi: 'Ngày xửa ngày xưa, có một cô thợ dệt trẻ tuổi tên là Elara.' }
      ]
    }
  ];

  for (const l of lessons) {
    const lesson = lessonRepo.create(l);
    const saved = await lessonRepo.save(lesson);
    console.log(`Created lesson: ${saved.title} (slug: ${saved.slug})`);

    // Add some vocab for the first lesson
    if (saved.order_index === 1) {
      const vocabs = [
        { term: 'Cemetery', definition: 'Nghĩa trang', ipa: '/ˈsem.ə.tri/', word_type: 'n', lesson_id: saved.id },
        { term: 'Curious', definition: 'Tò mò', ipa: '/ˈkjʊə.ri.əs/', word_type: 'adj', lesson_id: saved.id },
        { term: 'Atmosphere', definition: 'Bầu không khí', ipa: '/ˈæt.mə.sfɪər/', word_type: 'n', lesson_id: saved.id }
      ];
      for (const v of vocabs) {
        await vocabRepo.save(vocabRepo.create(v));
      }
    }
  }

  await app.close();
  console.log('Seeding completed successfully!');
}

seed();
