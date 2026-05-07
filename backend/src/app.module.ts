import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Vocabulary } from './entities/vocabulary.entity';
import { UserVocabularyProgress } from './entities/user-vocabulary-progress.entity';
import { SiteStats } from './entities/site-stats.entity';
import { MediaModule } from './modules/media/media.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [
          User,
          Course,
          Lesson,
          Vocabulary,
          UserVocabularyProgress,
          SiteStats
        ],
        synchronize: true,
      }),
    }),
    MediaModule,
    CoursesModule,
    LessonsModule,
    VocabularyModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
