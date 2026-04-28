import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-lesson-pov',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500 max-w-4xl">
      <form [formGroup]="povForm" (ngSubmit)="onSave()" class="space-y-8">
        <div class="bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex items-center gap-5 mb-10">
            <div class="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 class="text-2xl font-black">Point Of View (POV)</h3>
              <p class="text-gray-500 font-medium">Thay đổi góc nhìn thời gian hoặc đại từ để luyện ngữ pháp tự nhiên</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Audio URL (.mp3)</label>
              <div class="relative">
                <input type="text" formControlName="pov_audio_url" placeholder="https://..."
                       class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-5 px-8 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">🎵</span>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Transcript (VTT URL)</label>
              <div class="relative">
                <input type="text" formControlName="pov_vtt_url" placeholder="https://..."
                       class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-5 px-8 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">📄</span>
              </div>
            </div>
          </div>

          <!-- Preview Info -->
          <div class="mt-12 p-8 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10">
             <div class="flex gap-4">
                <div class="text-2xl">💡</div>
                <div class="space-y-2">
                   <h4 class="font-black text-rose-900 dark:text-rose-400">Bạn có biết?</h4>
                   <p class="text-sm text-rose-700/70 dark:text-rose-400/60 leading-relaxed">
                     Phần POV là điểm cốt lõi của phương pháp Effortless English. Hãy đảm bảo Audio rõ ràng và VTT được căn chỉnh chính xác thời gian.
                   </p>
                </div>
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 pb-10">
          <button type="submit" [disabled]="povForm.invalid || loading()"
                  class="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu cài đặt POV
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AdminLessonPovComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonEditService = inject(LessonEditService);
  loading = this.lessonEditService.loading;

  povForm = this.fb.group({
    pov_audio_url: [''],
    pov_vtt_url: ['']
  });

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.povForm.patchValue({
          pov_audio_url: lesson.pov_audio_url,
          pov_vtt_url: lesson.pov_vtt_url
        });
      }
    });
  }

  ngOnInit() {}

  onSave() {
    if (this.povForm.invalid) return;
    this.lessonEditService.saveSection(this.povForm.value as any).subscribe();
  }
}
