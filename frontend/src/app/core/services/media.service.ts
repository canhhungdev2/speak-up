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
    const url = this.getMediaUrl('vtt', filename);
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(content => parseVtt(content))
    );
  }
}
