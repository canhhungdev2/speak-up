import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin, concatMap } from 'rxjs';

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
  definition_vi?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  private translateUrl = 'https://api.mymemory.translated.net/get';

  fetchWordDetails(word: string): Observable<DictionaryEntry | null> {
    if (!word?.trim()) return of(null);

    return this.http.get<DictionaryEntry[]>(`${this.apiUrl}/${word.trim().toLowerCase()}`).pipe(
      map(entries => (entries && entries.length > 0 ? entries[0] : null)),
      concatMap(entry => {
        if (!entry) return of(null);
        
        const firstDef = entry.meanings[0]?.definitions[0]?.definition;
        if (!firstDef) return of(entry);

        return this.translateToVietnamese(firstDef).pipe(
          map(translation => ({
            ...entry,
            definition_vi: translation
          }))
        );
      }),
      catchError(() => of(null))
    );
  }

  private translateToVietnamese(text: string): Observable<string> {
    const url = `${this.translateUrl}?q=${encodeURIComponent(text)}&langpair=en|vi`;
    return this.http.get<any>(url).pipe(
      map(res => res.responseData?.translatedText || ''),
      catchError(() => of(''))
    );
  }
}
