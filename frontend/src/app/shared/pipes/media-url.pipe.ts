import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'mediaUrl',
  standalone: true
})
export class MediaUrlPipe implements PipeTransform {
  private readonly baseUrl = environment.apiBaseUrl;

  transform(value: string | undefined | null): string {
    if (!value) return '';

    let cleanValue = value.trim();
    
    // Safety check: Handle case where data was accidentally saved as a JSON string (e.g. {"url":"..."})
    if (cleanValue.startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanValue);
        if (parsed.url) cleanValue = parsed.url;
      } catch (e) {
        // Not a valid JSON, continue with original value
      }
    }
    
    // If it's already a full URL, return as is
    if (cleanValue.startsWith('http')) {
      return cleanValue;
    }
    
    // Normalize backslashes to forward slashes (important for Windows-saved paths)
    let path = cleanValue.replace(/\\/g, '/');
    
    // If it starts with /media or /, prepend baseUrl if needed
    if (path.startsWith('/media') || path.startsWith('/')) {
      if (!path.startsWith('/')) path = '/' + path;
      return `${this.baseUrl}${path}`;
    }
    
    // If it's a relative path like "courses/xxx/yyy.jpg", prepend /media/
    if (path.includes('/')) {
      return `${this.baseUrl}/media/${path}`;
    }

    // Default fallback (e.g. "story1.mp3"), assume it's in audio/
    return `${this.baseUrl}/media/audio/${path}`;
  }
}
