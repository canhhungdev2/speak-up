import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/analytics`;

  trackVisit() {
    // Check if we already tracked this session to avoid double counting on refresh
    const sessionTracked = sessionStorage.getItem('site_visit_tracked');
    if (sessionTracked) return;

    this.http.post(`${this.apiUrl}/track-visit`, {}).pipe(
      catchError(err => {
        console.error('Failed to track visit', err);
        return of(null);
      })
    ).subscribe(() => {
      sessionStorage.setItem('site_visit_tracked', 'true');
    });
  }

  getStats(limit: number = 7) {
    return this.http.get<any[]>(`${this.apiUrl}/stats`, { params: { limit } });
  }
}
