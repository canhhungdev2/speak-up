import { Component, Input, Output, EventEmitter, signal, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AdminFileUploadComponent } from '../../../../shared/components/admin-file-upload.component';

@Component({
  selector: 'app-admin-mini-story-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminFileUploadComponent],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div class="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-emerald-500/5">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white">{{ isEditMode ? 'Chỉnh sửa Mini Story #' + nextIndex : 'Thêm Mini Story mới' }}</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tải lên tài nguyên cho câu chuyện</p>
             </div>
          </div>
          <button (click)="close.emit()" class="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Audio Upload -->
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">File Audio (.mp3)</label>
              <app-admin-file-upload 
                #audioUpload
                [accept]="'audio/mpeg'"
                [placeholder]="'Chọn file âm thanh cho story'"
                [courseSlug]="courseSlug"
                [lessonSlug]="lessonSlug"
                [customName]="audioCustomName"
                [autoUpload]="false"
                [(ngModel)]="audioUrl"
              ></app-admin-file-upload>
            </div>

            <!-- Transcript Upload -->
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">File Transcript (.vtt)</label>
              <app-admin-file-upload 
                #vttUpload
                [accept]="'.vtt'"
                [placeholder]="'Chọn file phụ đề (VTT)'"
                [courseSlug]="courseSlug"
                [lessonSlug]="lessonSlug"
                [customName]="vttCustomName"
                [autoUpload]="false"
                [(ngModel)]="vttUrl"
              ></app-admin-file-upload>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5 mt-4">
            <button type="button" (click)="close.emit()" 
                    class="px-8 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
              Hủy bỏ
            </button>
            <button type="button" (click)="onSave()" [disabled]="!audioUrl || !vttUrl || isSaving()"
                    class="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
              @if (isSaving()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              } @else {
                {{ isEditMode ? 'Lưu thay đổi' : 'Thêm vào danh sách' }}
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminMiniStoryModalComponent {
  @Input() courseSlug: string = '';
  @Input() lessonSlug: string = '';
  @Input() nextIndex: number = 1;
  @Input() isEditMode: boolean = false;
  @Input() initialAudioUrl: string = '';
  @Input() initialVttUrl: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ audio_url: string; vtt_url: string }>();

  @ViewChild('audioUpload') audioUpload!: AdminFileUploadComponent;
  @ViewChild('vttUpload') vttUpload!: AdminFileUploadComponent;

  audioUrl: string = '';
  vttUrl: string = '';
  isSaving = signal(false);

  get audioCustomName() { return `mini-story-${this.nextIndex}`; }
  get vttCustomName() { return `mini-story-${this.nextIndex}`; }

  ngOnInit() {
    if (this.isEditMode) {
      this.audioUrl = this.initialAudioUrl;
      this.vttUrl = this.initialVttUrl;
    }
  }

  async onSave() {
    if (!this.audioUrl || !this.vttUrl) return;
    
    this.isSaving.set(true);
    try {
      const audio_url = await this.audioUpload.uploadNow();
      const vtt_url = await this.vttUpload.uploadNow();

      this.save.emit({
        audio_url,
        vtt_url
      });
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi tải lên. Vui lòng thử lại.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
