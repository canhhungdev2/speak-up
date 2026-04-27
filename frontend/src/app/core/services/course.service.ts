import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  thumbnail: string;
  slug: string;
  rating?: number;
  lessons_count?: number;
  status?: string;
  enrollment?: number;
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

  uploadThumbnail(courseSlug: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`http://localhost:3000/media/upload/course-thumbnail/${courseSlug}`, formData, {
      responseType: 'text' as 'json'
    });
  }

  create(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      tap(() => this.findAll().subscribe())
    );
  }

  update(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}`, course).pipe(
      tap(() => this.findAll().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.findAll().subscribe())
    );
  }
}
