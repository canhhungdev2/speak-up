import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-lesson-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500">
      <form [formGroup]="articleForm" (ngSubmit)="onSave()" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left: Title & Audio -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <h3 class="text-lg font-black mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">A</span>
                Cài đặt cơ bản
              </h3>
              
              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề bài học</label>
                  <input type="text" formControlName="title" 
                         class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-xl py-4 px-6 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Audio URL (.mp3)</label>
                  <input type="text" formControlName="main_audio_url"
                         class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-xl py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all">
                </div>
              </div>
            </div>

            <!-- Stats/Tips -->
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
              <h4 class="font-black text-lg mb-2">Mẹo nhỏ ✨</h4>
              <p class="text-indigo-100 text-sm leading-relaxed">
                Nội dung song ngữ giúp người học dễ dàng đối chiếu. Hãy chia nhỏ các đoạn văn để trải nghiệm đọc tốt hơn.
              </p>
            </div>
          </div>

          <!-- Right: Bilingual Content -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-black flex items-center gap-2">
                  <span class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">B</span>
                  Nội dung song ngữ
                </h3>
                <button type="button" (click)="addRow()" 
                        class="px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                  + Thêm dòng
                </button>
              </div>

              <div formArrayName="main_content_bilingual" class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                @for (row of rows.controls; track row; let i = $index) {
                  <div [formGroupName]="i" class="p-6 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 relative group">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tiếng Anh</label>
                        <textarea formControlName="en" placeholder="English text..." rows="3" 
                                  class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm font-medium leading-relaxed"></textarea>
                      </div>
                      <div class="space-y-2">
                        <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tiếng Việt</label>
                        <textarea formControlName="vi" placeholder="Bản dịch tiếng Việt..." rows="3" 
                                  class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm italic text-gray-500 leading-relaxed"></textarea>
                      </div>
                    </div>
                    <button type="button" (click)="removeRow(i)" 
                            class="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                }

                @if (rows.length === 0) {
                  <div class="py-12 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 text-gray-400">
                    <span class="text-4xl">📄</span>
                    <p class="font-bold">Chưa có nội dung nào.</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 pb-10">
          <button type="submit" [disabled]="articleForm.invalid || loading()"
                  class="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu thay đổi Article
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
  `]
})
export class AdminLessonArticleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonEditService = inject(LessonEditService);
  loading = this.lessonEditService.loading;

  articleForm = this.fb.group({
    title: ['', [Validators.required]],
    main_audio_url: [''],
    main_content_bilingual: this.fb.array([])
  });

  get rows() { return this.articleForm.get('main_content_bilingual') as FormArray; }

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.articleForm.patchValue({
          title: lesson.title,
          main_audio_url: lesson.main_audio_url
        });
        this.rows.clear();
        lesson.main_content_bilingual?.forEach((row: any) => this.addRow(row));
      }
    });
  }

  ngOnInit() {}

  addRow(data?: { en: string, vi: string }) {
    this.rows.push(this.fb.group({
      en: [data?.en || ''],
      vi: [data?.vi || '']
    }));
  }

  removeRow(index: number) { this.rows.removeAt(index); }

  onSave() {
    if (this.articleForm.invalid) return;
    this.lessonEditService.saveSection(this.articleForm.value as any).subscribe();
  }
}
