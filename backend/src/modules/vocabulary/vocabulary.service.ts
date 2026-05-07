import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { Vocabulary } from '../../entities/vocabulary.entity';
import { UserVocabularyProgress } from '../../entities/user-vocabulary-progress.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabularyRepository: Repository<Vocabulary>,
    @InjectRepository(UserVocabularyProgress)
    private readonly progressRepository: Repository<UserVocabularyProgress>,
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
      order: { order_index: 'ASC' }
    });
  }

  async reorder(orderData: { id: string, order_index: number }[]) {
    const promises = orderData.map(item => 
      this.vocabularyRepository.update(item.id, { order_index: item.order_index })
    );
    return Promise.all(promises);
  }

  // --- SRS Methods ---

  async findDueByUserId(userId: string) {
    return this.progressRepository.find({
      where: {
        user_id: userId,
        next_review_at: LessThanOrEqual(new Date())
      },
      relations: ['vocabulary'],
      order: { next_review_at: 'ASC' }
    });
  }

  async updateSRSProgress(userId: string, vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy') {
    let progress = await this.progressRepository.findOneBy({ user_id: userId, vocabulary_id: vocabId });

    if (!progress) {
      progress = this.progressRepository.create({
        user_id: userId,
        vocabulary_id: vocabId,
        interval: 0,
        ease_factor: 2.5,
        repetitions: 0
      });
    }

    const now = new Date();
    let { interval, ease_factor, repetitions } = progress;

    switch (rating) {
      case 'again':
        interval = 0;
        repetitions = 0;
        // Optionally decrease ease factor
        ease_factor = Math.max(1.3, ease_factor - 0.2);
        break;
      case 'hard':
        interval = interval === 0 ? 1 : Math.ceil(interval * 1.2);
        repetitions += 1;
        ease_factor = Math.max(1.3, ease_factor - 0.15);
        break;
      case 'good':
        interval = interval === 0 ? 1 : interval === 1 ? 3 : Math.ceil(interval * ease_factor);
        repetitions += 1;
        break;
      case 'easy':
        interval = interval === 0 ? 4 : Math.ceil(interval * ease_factor * 1.3);
        repetitions += 1;
        ease_factor = Math.min(5.0, ease_factor + 0.15);
        break;
    }

    const nextReview = new Date();
    nextReview.setDate(now.getDate() + interval);

    progress.interval = interval;
    progress.ease_factor = ease_factor;
    progress.repetitions = repetitions;
    progress.next_review_at = nextReview;
    progress.last_reviewed_at = now;
    progress.status = interval > 30 ? 'mastered' : 'learning';

    return this.progressRepository.save(progress);
  }

  async learn(userId: string, vocabId: string) {
    let progress = await this.progressRepository.findOneBy({ user_id: userId, vocabulary_id: vocabId });

    if (!progress) {
      progress = this.progressRepository.create({
        user_id: userId,
        vocabulary_id: vocabId,
        interval: 0,
        ease_factor: 2.5,
        repetitions: 0,
        next_review_at: new Date() // Review immediately
      });
      return this.progressRepository.save(progress);
    }

    return progress;
  }

  async learnBatch(userId: string, items: { vocabId: string; rating: 'again' | 'hard' | 'good' | 'easy' }[]) {
    const results: UserVocabularyProgress[] = [];
    for (const item of items) {
      const result = await this.updateSRSProgress(userId, item.vocabId, item.rating);
      results.push(result);
    }
    return results;
  }

  async findAllProgressByUserId(userId: string) {
    return this.progressRepository.find({
      where: { user_id: userId },
      relations: ['vocabulary'],
      order: { next_review_at: 'ASC' }
    });
  }

  async removeProgress(userId: string, progressId: string) {
    return this.progressRepository.delete({ id: progressId, user_id: userId });
  }

  async getStats(userId: string) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [mastered, learning, due, newToday] = await Promise.all([
      this.progressRepository.countBy({ user_id: userId, status: 'mastered' }),
      this.progressRepository.countBy({ user_id: userId, status: 'learning' }),
      this.progressRepository.count({
        where: {
          user_id: userId,
          next_review_at: LessThanOrEqual(new Date())
        }
      }),
      this.progressRepository.count({
        where: {
          user_id: userId,
          created_at: MoreThanOrEqual(startOfToday)
        }
      })
    ]);

    const total = mastered + learning;
    const accuracy = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return { mastered, learning, due, newToday, accuracy };
  }

  async getForecast(userId: string) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const forecast: { label: string; count: number; value: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      
      const nextDate = new Date(targetDate);
      nextDate.setHours(23, 59, 59, 999);

      const count = await this.progressRepository.count({
        where: {
          user_id: userId,
          next_review_at: Between(targetDate, nextDate)
        }
      });

      forecast.push({
        label: days[targetDate.getDay()],
        count: count,
        value: count 
      });
    }

    return forecast;
  }
}
