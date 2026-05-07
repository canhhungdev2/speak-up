import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminFileUploadComponent } from '../../../../shared/components/admin-file-upload.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-lesson-commentary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminFileUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500 max-w-4xl">
      <form [formGroup]="commentaryForm" (ngSubmit)="onSave()" class="space-y-8">
        <div class="bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex items-center gap-5 mb-10">
            <div class="w-16 h-16 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            </div>
            <div>
              <h3 class="text-2xl font-black">Commentary</h3>
              <p class="text-gray-500 font-medium">Giải thích ý nghĩa và văn hóa đằng sau nội dung bài học</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Audio Upload -->
            <div class="space-y-3">
              <label class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Audio Commentary (.mp3)</label>
              <app-admin-file-upload 
                formControlName="commentary_audio_url"
                [accept]="'audio/mpeg'"
                [courseSlug]="courseSlug"
                [lessonSlug]="lessonSlug"
                [customName]="'commentary'"
                [placeholder]="'Tải lên Audio Commentary'"
              ></app-admin-file-upload>
            </div>

            <!-- VTT Upload -->
            <div class="space-y-3">
              <label class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Transcript Commentary (.vtt)</label>
              <app-admin-file-upload 
                formControlName="commentary_vtt_url"
                [accept]="'.vtt'"
                [courseSlug]="courseSlug"
                [lessonSlug]="lessonSlug"
                [customName]="'commentary'"
                [placeholder]="'Tải lên Transcript Commentary'"
              ></app-admin-file-upload>
            </div>
          </div>

          <!-- Tip -->
          <div class="mt-12 p-8 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10">
             <div class="flex gap-4">
                <div class="text-2xl">⚡</div>
                <div class="space-y-2">
                   <h4 class="font-black text-indigo-900 dark:text-indigo-400">Giải thích chi tiết</h4>
                   <p class="text-sm text-indigo-700/70 dark:text-indigo-400/60 leading-relaxed">
                     Commentary giúp người học hiểu sâu hơn về cách dùng từ trong thực tế. Đảm bảo file audio có tốc độ nói vừa phải và tự nhiên.
                   </p>
                </div>
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 pb-10">
          <button type="submit" [disabled]="commentaryForm.invalid || loading()"
                  class="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu cài đặt Commentary
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AdminLessonCommentaryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private lessonEditService = inject(LessonEditService);
  loading = this.lessonEditService.loading;

  get courseSlug() { return this.route.parent?.snapshot.paramMap.get('courseSlug') || ''; }
  get lessonSlug() { return this.route.parent?.snapshot.paramMap.get('lessonSlug') || ''; }

  commentaryForm = this.fb.group({
    commentary_audio_url: [''],
    commentary_vtt_url: ['']
  });

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.commentaryForm.patchValue({
          commentary_audio_url: lesson.commentary_audio_url,
          commentary_vtt_url: lesson.commentary_vtt_url
        });
      }
    });
  }

  ngOnInit() {}

  onSave() {
    if (this.commentaryForm.invalid) return;
    this.lessonEditService.saveSection(this.commentaryForm.value as any).subscribe();
  }
}
