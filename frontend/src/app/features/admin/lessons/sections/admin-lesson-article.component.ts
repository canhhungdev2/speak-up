import { Component, ChangeDetectionStrategy, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor.component';

@Component({
  selector: 'app-admin-lesson-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RichTextEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500">
      <form [formGroup]="articleForm" (ngSubmit)="onSave()" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left: Settings & Tips -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <h3 class="text-lg font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <span class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">A</span>
                Cài đặt
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

            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
              <h4 class="font-black text-lg mb-2">Editor Thông minh ✨</h4>
              <p class="text-indigo-100 text-xs leading-relaxed">
                Bạn không cần nhập từng dòng nữa. Chỉ cần dán toàn bộ bài viết, hệ thống sẽ tự động chia đoạn khi lưu.
              </p>
              <div class="mt-4 flex flex-col gap-2">
                <div class="flex items-center gap-2 text-[10px] font-bold bg-white/10 p-2 rounded-lg">
                    <span class="px-1.5 py-0.5 bg-white/20 rounded">Enter</span> Tách thành đoạn mới
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Unified Rich Editors -->
          <div class="lg:col-span-3 space-y-6">
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white">
                  <span class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">B</span>
                  Soạn thảo nội dung bài học
                </h3>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <button type="button" (click)="editorEn.execCommand('bold')" class="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all font-black">B</button>
                    <button type="button" (click)="editorEn.execCommand('italic')" class="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all italic font-black">I</button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- English Editor -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nội dung tiếng Anh</label>
                  </div>
                  <app-rich-text-editor 
                    #editorEn
                    formControlName="fullContentEn" 
                    [placeholder]="'Paste or type English article here... Use Enter to separate paragraphs.'"
                  ></app-rich-text-editor>
                </div>

                <!-- Vietnamese Editor -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Bản dịch tiếng Việt</label>
                  </div>
                  <app-rich-text-editor 
                    #editorVi
                    formControlName="fullContentVi" 
                    [placeholder]="'Dán hoặc nhập bản dịch tiếng Việt tương ứng tại đây...'"
                  ></app-rich-text-editor>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-end gap-4">
              <button type="submit" [disabled]="articleForm.invalid || loading()"
                      class="bg-primary text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                @if (loading()) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                }
                Lưu và Tự động Chia đoạn
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep app-rich-text-editor .prose {
      min-height: 500px;
    }
  `]
})
export class AdminLessonArticleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonEditService = inject(LessonEditService);
  
  loading = this.lessonEditService.loading;

  @ViewChild('editorEn') editorEn!: RichTextEditorComponent;
  @ViewChild('editorVi') editorVi!: RichTextEditorComponent;

  articleForm = this.fb.group({
    title: ['', [Validators.required]],
    main_audio_url: [''],
    fullContentEn: [''],
    fullContentVi: ['']
  });

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.articleForm.patchValue({
          title: lesson.title,
          main_audio_url: lesson.main_audio_url
        });
        
        // Convert array to unified HTML
        if (lesson.main_content_bilingual) {
          const enHtml = lesson.main_content_bilingual.map((r: any) => `<p>${r.en}</p>`).join('');
          const viHtml = lesson.main_content_bilingual.map((r: any) => `<p>${r.vi}</p>`).join('');
          this.articleForm.patchValue({
            fullContentEn: enHtml,
            fullContentVi: viHtml
          });
        }
      }
    });
  }

  ngOnInit() {}

  onSave() {
    if (this.articleForm.invalid) return;

    const enHtml = this.articleForm.get('fullContentEn')?.value || '';
    const viHtml = this.articleForm.get('fullContentVi')?.value || '';

    // Parsing logic: extract paragraphs from HTML
    const enParagraphs = this.parseParagraphs(enHtml);
    const viParagraphs = this.parseParagraphs(viHtml);

    const maxLen = Math.max(enParagraphs.length, viParagraphs.length);
    const bilingualContent = [];

    for (let i = 0; i < maxLen; i++) {
      bilingualContent.push({
        en: enParagraphs[i] || '',
        vi: viParagraphs[i] || ''
      });
    }

    const payload = {
      ...this.articleForm.value,
      main_content_bilingual: bilingualContent
    };

    // Remove the temporary fullContent fields before sending to backend
    delete (payload as any).fullContentEn;
    delete (payload as any).fullContentVi;

    this.lessonEditService.saveSection(payload as any).subscribe();
  }

  private parseParagraphs(html: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Standard way: get all P tags or top-level blocks
    let paragraphs = Array.from(doc.body.children).map(child => child.innerHTML.trim());
    
    // If no children (just text), split by double newline or use the text itself
    if (paragraphs.length === 0 && doc.body.innerHTML.trim()) {
      paragraphs = [doc.body.innerHTML.trim()];
    }

    return paragraphs.filter(p => p !== '');
  }
}
