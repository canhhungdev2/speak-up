import { Component, Input, Output, EventEmitter, signal, inject, forwardRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MediaService } from '../../core/services/media.service';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-audio-upload',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminAudioUploadComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative group">
      <!-- Upload Zone -->
      <div 
        (click)="fileInput.click()"
        (dragover)="$event.preventDefault(); isDragging.set(true)"
        (dragleave)="isDragging.set(false)"
        (drop)="onDrop($event)"
        [class.border-primary]="isDragging() || !!value"
        [class.bg-primary/5]="isDragging()"
        class="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] p-8 transition-all cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/2 flex flex-col items-center justify-center gap-4 min-h-[180px] relative overflow-hidden"
      >
        <input #fileInput type="file" class="hidden" accept="audio/*" (change)="onFileSelected($event)">
        
        @if (isUploading()) {
          <!-- Progress State -->
          <div class="flex flex-col items-center gap-3 w-full max-w-xs animate-in zoom-in-95">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <div class="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                <div class="bg-primary h-full transition-all duration-300" [style.width.%]="uploadProgress()"></div>
            </div>
            <p class="text-xs font-black text-primary uppercase tracking-widest">Đang tải lên {{ uploadProgress() }}%</p>
          </div>
        } @else if (value) {
          <!-- Success/Play State -->
          <div class="flex flex-col items-center gap-4 w-full animate-in slide-in-from-bottom-4">
             <div class="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-primary/20 w-full">
                <button type="button" (click)="$event.stopPropagation(); togglePlay()" 
                        class="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  @if (isPlaying()) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  }
                </button>
                <div class="flex-grow min-w-0">
                   <p class="text-xs font-black text-gray-900 dark:text-white truncate">{{ getFileName() }}</p>
                   <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Sẵn sàng sử dụng</p>
                </div>
                <button type="button" (click)="$event.stopPropagation(); clear()" 
                        class="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
          </div>
        } @else {
          <!-- Empty State -->
          <div class="flex flex-col items-center gap-2 text-center group-hover:scale-105 transition-transform">
            <div class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
            <div>
              <p class="text-sm font-black text-gray-700 dark:text-gray-300">Nhấn để tải lên file audio</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Hỗ trợ .mp3, .m4a, .wav</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminAudioUploadComponent implements ControlValueAccessor, OnDestroy {
  @Input() courseSlug: string = '';
  @Input() lessonSlug: string = '';
  @Input() customName: string = '';
  @Output() uploadSuccess = new EventEmitter<string>();

  private mediaService = inject(MediaService);
  
  value: string = '';
  isUploading = signal(false);
  uploadProgress = signal(0);
  isDragging = signal(false);
  isPlaying = signal(false);

  private audio = new Audio();
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor() {
    this.audio.onended = () => this.isPlaying.set(false);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.upload(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.upload(file);
    }
  }

  private upload(file: File) {
    if (!this.courseSlug || !this.lessonSlug) {
      alert('Vui lòng lưu thông tin bài học trước khi tải lên audio!');
      return;
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.mediaService.uploadLessonMedia(this.courseSlug, this.lessonSlug, file, this.customName).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress.set(Math.round(100 * event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.isUploading.set(false);
          this.value = event.body.url; // Extract URL from object
          this.onChange(this.value);
          this.uploadSuccess.emit(this.value);
        }
      },
      error: () => {
        this.isUploading.set(false);
        alert('Tải lên thất bại. Vui lòng thử lại.');
      }
    });
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      const url = this.value.startsWith('http') ? this.value : `${environment.apiBaseUrl}${this.value}`;
      this.audio.src = url;
      this.audio.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  getFileName() {
    return this.value.split('/').pop() || 'audio-file.mp3';
  }

  clear() {
    this.value = '';
    this.onChange(this.value);
    this.audio.pause();
    this.isPlaying.set(false);
  }

  ngOnDestroy() {
    this.audio.pause();
    this.isPlaying.set(false);
  }
}
