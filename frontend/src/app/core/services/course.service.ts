import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  thumbnail: string;
  slug: string;
  rating?: number;
  lessons_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/courses';

  courses = signal<Course[]>([]);

  findAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      tap(courses => this.courses.set(courses))
    );
  }

  findOneBySlug(slug: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${slug}`);
  }
}
