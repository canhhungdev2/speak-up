import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  type: string;
  content_url: string;
  content_bilingual: any[];
  duration: number;
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
