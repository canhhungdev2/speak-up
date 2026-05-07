import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Vocabulary {
  id: string;
  lesson_id: string;
  term: string;
  ipa?: string;
  definition: string;
  translation?: string;
  definition_vi?: string;
  example?: string;
  word_type?: string;
  audio_url?: string;
  created_at?: string;
}

export interface UserVocabularyProgress {
  id: string;
  vocabulary_id: string;
  vocabulary: Vocabulary;
  status: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string;
}

export interface VocabularyStats {
  mastered: number;
  learning: number;
  due: number;
}

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/vocabulary`;

  create(data: Partial<Vocabulary>): Observable<Vocabulary> {
    return this.http.post<Vocabulary>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Vocabulary>): Observable<Vocabulary> {
    return this.http.patch<Vocabulary>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findByLesson(lessonId: string): Observable<Vocabulary[]> {
    return this.http.get<Vocabulary[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  reorder(orderData: { id: string; order_index: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/reorder`, orderData);
  }

  // --- SRS Methods ---

  getDueWords(): Observable<UserVocabularyProgress[]> {
    return this.http.get<UserVocabularyProgress[]>(`${this.apiUrl}/due`);
  }

  updateSRSProgress(vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy'): Observable<UserVocabularyProgress> {
    return this.http.post<UserVocabularyProgress>(`${this.apiUrl}/review`, { vocabId, rating });
  }

  learn(vocabId: string): Observable<UserVocabularyProgress> {
    return this.http.post<UserVocabularyProgress>(`${this.apiUrl}/learn`, { vocabId });
  }

  learnBatch(items: { vocabId: string; rating: 'again' | 'hard' | 'good' | 'easy' }[]): Observable<UserVocabularyProgress[]> {
    return this.http.post<UserVocabularyProgress[]>(`${this.apiUrl}/learn-batch`, { items });
  }

  getStats(): Observable<VocabularyStats> {
    return this.http.get<VocabularyStats>(`${this.apiUrl}/stats`);
  }
}
