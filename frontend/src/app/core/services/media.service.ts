import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { parseVtt, StorySentence } from '../utils/vtt-parser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/media`;

  getMediaUrl(type: 'audio' | 'vtt', filename: string): string {
    return `${this.baseUrl}/${type}/${filename}`;
  }

  fetchAndParseVtt(filename: string): Observable<StorySentence[]> {
    const url = filename.startsWith('http') ? filename : `${this.baseUrl}/${filename}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(content => parseVtt(content))
    );
  }

  uploadLessonMedia(courseSlug: string, lessonSlug: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload/lesson-media/${courseSlug}/${lessonSlug}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadCourseThumbnail(courseSlug: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload/course-thumbnail/${courseSlug}`, formData);
  }
}
