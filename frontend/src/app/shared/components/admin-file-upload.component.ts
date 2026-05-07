import { Component, Input, Output, EventEmitter, signal, inject, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MediaService } from '../../core/services/media.service';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-file-upload',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminFileUploadComponent),
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
        class="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] p-6 transition-all cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/2 flex flex-col items-center justify-center gap-3 min-h-[140px] relative overflow-hidden"
      >
        <input #fileInput type="file" class="hidden" [accept]="accept" (change)="onFileSelected($event)">
        
        @if (isUploading()) {
          <!-- Progress State -->
          <div class="flex flex-col items-center gap-3 w-full max-w-xs animate-in zoom-in-95">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <div class="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div class="bg-primary h-full transition-all duration-300" [style.width.%]="uploadProgress()"></div>
            </div>
            <p class="text-[10px] font-black text-primary uppercase tracking-widest">Tải lên {{ uploadProgress() }}%</p>
          </div>
        } @else if (value) {
          <!-- Success State -->
          <div class="flex flex-col items-center gap-3 w-full animate-in slide-in-from-bottom-4">
             <div class="flex items-center gap-4 p-3 bg-white dark:bg-white/5 rounded-2xl border border-primary/20 w-full">
                <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                   @if (isAudio()) {
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                   } @else {
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   }
                </div>
                <div class="flex-grow min-w-0">
                   <p class="text-[10px] font-black text-gray-900 dark:text-white truncate">{{ getFileName() }}</p>
                   <p class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Đã tải lên thành công</p>
                </div>
                <button type="button" (click)="$event.stopPropagation(); clear()" 
                        class="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
             @if (isAudio()) {
               <button type="button" (click)="$event.stopPropagation(); togglePlay()" 
                       class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                 {{ isPlaying() ? 'Dừng nghe thử' : 'Nghe thử âm thanh' }}
               </button>
             } @else if (isVtt()) {
               <button type="button" (click)="$event.stopPropagation(); toggleVttPreview()" 
                       class="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                 {{ showVttPreview() ? 'Đóng xem trước' : 'Xem trước phụ đề' }}
               </button>
             }
          </div>
          @if (showVttPreview()) {
             <div class="w-full mt-2 bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 max-h-40 overflow-y-auto text-left" (click)="$event.stopPropagation()">
               <pre class="text-[10px] font-mono text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{{ vttContent() || 'Đang tải...' }}</pre>
             </div>
          }
        } @else {
          <!-- Empty State -->
          <div class="flex flex-col items-center gap-2 text-center group-hover:scale-105 transition-transform">
            <div class="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            </div>
            <div>
              <p class="text-[11px] font-black text-gray-700 dark:text-gray-300">{{ placeholder }}</p>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Kéo thả hoặc nhấn để chọn file</p>
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
export class AdminFileUploadComponent implements ControlValueAccessor, OnDestroy {
  @Input() accept: string = '*/*';
  @Input() placeholder: string = 'Tải lên file';
  @Input() courseSlug: string = '';
  @Input() lessonSlug: string = '';
  @Input() customName: string = '';
  @Input() autoUpload: boolean = true;
  @Output() uploadSuccess = new EventEmitter<string>();

  private mediaService = inject(MediaService);
  
  value: string = '';
  selectedFile: File | null = null;
  isUploading = signal(false);
  uploadProgress = signal(0);
  isDragging = signal(false);
  isPlaying = signal(false);
  showVttPreview = signal(false);
  vttContent = signal<string>('');

  private audio = new Audio();
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor() {
    this.audio.onended = () => this.isPlaying.set(false);
  }

  isAudio() {
    return this.accept.includes('audio') || this.value.endsWith('.mp3') || this.value.endsWith('.m4a');
  }

  isVtt() {
    return this.accept.includes('.vtt') || this.value.endsWith('.vtt');
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
    if (file) this.handleFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File) {
    if (this.autoUpload) {
      this.upload(file);
    } else {
      this.selectedFile = file;
      this.value = file.name;
      this.onChange(this.value);
    }
  }

  uploadNow(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) return resolve(this.value);
      
      this.isUploading.set(true);
      this.uploadProgress.set(0);

      this.mediaService.uploadLessonMedia(this.courseSlug, this.lessonSlug, this.selectedFile, this.customName).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress.set(Math.round(100 * event.loaded / event.total));
          } else if (event.type === HttpEventType.Response) {
            this.isUploading.set(false);
            this.value = event.body.url;
            this.selectedFile = null;
            this.onChange(this.value);
            this.uploadSuccess.emit(this.value);
            resolve(this.value);
          }
        },
        error: (err) => {
          this.isUploading.set(false);
          reject(err);
        }
      });
    });
  }

  private upload(file: File) {
    if (!this.courseSlug || !this.lessonSlug) {
      alert('Vui lòng lưu thông tin bài học trước khi tải lên media!');
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
          this.value = event.body.url;
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
      const url = this.selectedFile 
        ? URL.createObjectURL(this.selectedFile) 
        : (this.value.startsWith('http') ? this.value : `${environment.apiBaseUrl}${this.value}`);
      this.audio.src = url;
      this.audio.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  async toggleVttPreview() {
    if (this.showVttPreview()) {
      this.showVttPreview.set(false);
      return;
    }

    this.showVttPreview.set(true);
    if (this.selectedFile) {
      const text = await this.selectedFile.text();
      this.vttContent.set(text);
    } else {
      const url = this.value.startsWith('http') ? this.value : `${environment.apiBaseUrl}${this.value}`;
      try {
        const response = await fetch(url);
        const text = await response.text();
        this.vttContent.set(text);
      } catch (err) {
        this.vttContent.set('Không thể tải nội dung file phụ đề.');
      }
    }
  }

  getFileName() {
    return this.value.split('/').pop() || 'file';
  }

  clear() {
    this.value = '';
    this.selectedFile = null;
    this.onChange(this.value);
    this.audio.pause();
    this.isPlaying.set(false);
    this.showVttPreview.set(false);
    this.vttContent.set('');
  }

  ngOnDestroy() {
    this.audio.pause();
    this.isPlaying.set(false);
  }
}
