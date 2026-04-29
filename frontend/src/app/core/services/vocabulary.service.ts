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
}
