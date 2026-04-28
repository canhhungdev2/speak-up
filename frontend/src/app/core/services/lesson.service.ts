import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MiniStory {
  id?: string;
  lesson_id?: string;
  audio_url: string;
  vtt_url: string;
  order_index?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  main_audio_url: string;
  main_content_bilingual: { en: string; vi: string; }[];
  vocab_audio_url: string;
  pov_audio_url: string;
  pov_vtt_url: string;
  commentary_audio_url: string;
  commentary_vtt_url: string;
  mini_stories: MiniStory[];
  slug: string;
  order_index?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/lessons`;

  findAllByCourseId(courseId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/course/${courseId}`);
  }

  findOneBySlug(courseSlug: string, lessonSlug: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${courseSlug}/${lessonSlug}`);
  }

  create(data: any): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorder(orderData: any[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reorder`, orderData);
  }
}
