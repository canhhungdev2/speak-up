import { Injectable, signal, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Lesson, LessonService } from '../../../core/services/lesson.service';
import { tap, of, Observable } from 'rxjs';

@Injectable()
export class LessonEditService {
  private lessonService = inject(LessonService);
  
  private _lesson = signal<Lesson | null>(null);
  lesson = this._lesson.asReadonly();
  lesson$ = toObservable(this._lesson);
  
  loading = signal(false);
  error = signal<string | null>(null);

  loadLesson(courseSlug: string, lessonSlug: string) {
    this.loading.set(true);
    this.error.set(null);
    return this.lessonService.findOneBySlug(courseSlug, lessonSlug).pipe(
      tap({
        next: (lesson) => {
          this._lesson.set(lesson);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Không thể tải thông tin bài học');
          this.loading.set(false);
        }
      })
    );
  }

  updateLessonState(data: Partial<Lesson>) {
    this._lesson.update(current => current ? { ...current, ...data } : null);
  }

  saveSection(data: any): Observable<any> {
    const current = this._lesson();
    if (!current) return of(null);

    this.loading.set(true);
    return this.lessonService.update(current.id, data).pipe(
      tap({
        next: (updated) => {
          this._lesson.set(updated);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Lưu thất bại');
          this.loading.set(false);
        }
      })
    );
  }

  clear() {
    this._lesson.set(null);
  }
}
