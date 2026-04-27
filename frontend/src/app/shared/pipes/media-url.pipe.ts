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
    
    // If it's already a full URL, return as is
    if (value.startsWith('http')) {
      return value;
    }
    
    // If it starts with /media, prepend baseUrl
    if (value.startsWith('/media')) {
      return `${this.baseUrl}${value}`;
    }
    
    // Default fallback
    return value;
  }
}
