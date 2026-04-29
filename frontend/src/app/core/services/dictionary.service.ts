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
  translation?: string;
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
    const cleanWord = word.trim().toLowerCase();

    return this.http.get<DictionaryEntry[]>(`${this.apiUrl}/${encodeURIComponent(cleanWord)}`).pipe(
      map(entries => (entries && entries.length > 0 ? entries[0] : null)),
      concatMap(entry => {
        if (!entry) return this.fallbackTranslation(cleanWord);
        
        const firstDef = entry.meanings[0]?.definitions[0]?.definition;
        
        const wordTranslation$ = this.translateToVietnamese(cleanWord);
        const defTranslation$ = firstDef ? this.translateToVietnamese(firstDef) : of('');

        return forkJoin({
          wordTrans: wordTranslation$,
          defTrans: defTranslation$
        }).pipe(
          map(({ wordTrans, defTrans }) => ({
            ...entry,
            translation: wordTrans,
            definition_vi: defTrans
          }))
        );
      }),
      catchError(() => this.fallbackTranslation(cleanWord))
    );
  }

  private fallbackTranslation(word: string): Observable<DictionaryEntry | null> {
    return this.translateToVietnamese(word).pipe(
      map(translation => {
        return {
          word: word,
          phonetics: [],
          meanings: [
            {
              partOfSpeech: word.includes(' ') ? 'phrase' : 'noun',
              definitions: [
                {
                  definition: 'Phrase / Expression',
                  synonyms: [],
                  antonyms: []
                }
              ]
            }
          ],
          translation: translation || '',
          definition_vi: 'Cụm từ / Thành ngữ'
        } as DictionaryEntry;
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
