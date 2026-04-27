import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  type: string;
  content_url: string;
  content_bilingual: any[];
  duration: number;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/lessons';

  findOneBySlug(courseSlug: string, lessonSlug: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${courseSlug}/${lessonSlug}`);
  }
}
