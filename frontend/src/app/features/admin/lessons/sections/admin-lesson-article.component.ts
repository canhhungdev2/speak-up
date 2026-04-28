import { Component, ChangeDetectionStrategy, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor.component';
import { AdminAudioUploadComponent } from '../../../../shared/components/admin-audio-upload.component';

@Component({
  selector: 'app-admin-lesson-article',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RichTextEditorComponent, AdminAudioUploadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-bottom-10 duration-700">
      <form [formGroup]="articleForm" (ngSubmit)="onSave()" class="space-y-8">
        
        <!-- Part A: Settings (Top) -->
        <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex items-center gap-3 mb-8">
            <span class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-black">A</span>
            <div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white">Cấu hình bài học</h3>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tiêu đề & Tài nguyên âm thanh</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Title -->
            <div class="lg:col-span-1 space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề bài học</label>
                <input type="text" formControlName="title" 
                       placeholder="Nhập tiêu đề hấp dẫn..."
                       class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-5 px-8 font-black text-lg text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
              </div>
              
              <div class="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl border border-indigo-500/10">
                <h4 class="font-black text-indigo-500 text-sm mb-1 italic">Mẹo nhỏ ✨</h4>
                <p class="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                  Hãy đảm bảo âm thanh đã được chuẩn hóa âm lượng trước khi tải lên để học viên có trải nghiệm tốt nhất.
                </p>
              </div>
            </div>

            <!-- Audio Upload -->
            <div class="lg:col-span-2 space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Audio Bài học (MP3)</label>
              <app-admin-audio-upload 
                formControlName="main_audio_url"
                [courseSlug]="courseSlug"
                [lessonSlug]="lessonSlug"
                [customName]="'MainArticle'"
                (uploadSuccess)="onAudioUpload($event)"
              ></app-admin-audio-upload>
      </div>
          </div>
        </div>

        <!-- Part B: Unified Rich Editors (Bottom) -->
        <div class="bg-white dark:bg-[#1e293b] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-black">B</span>
              <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white">Nội dung song ngữ</h3>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Soạn thảo bài viết trực quan</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4 p-2 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-2 px-4 border-r border-gray-200 dark:border-white/10 mr-2">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phím tắt:</span>
                <kbd class="px-2 py-1 bg-white dark:bg-white/10 rounded text-[10px] font-bold">Ctrl+B</kbd>
                <kbd class="px-2 py-1 bg-white dark:bg-white/10 rounded text-[10px] font-bold">Ctrl+I</kbd>
              </div>
              <div class="flex gap-2">
                <button type="button" (click)="editorEn.execCommand('bold')" class="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl hover:bg-primary hover:text-white transition-all font-black shadow-sm">B</button>
                <button type="button" (click)="editorEn.execCommand('italic')" class="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 rounded-xl hover:bg-primary hover:text-white transition-all italic font-black shadow-sm">I</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <!-- English Editor -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nội dung tiếng Anh</label>
                </div>
                <span class="text-[10px] font-bold text-gray-400 italic">Mỗi đoạn văn là một khối riêng biệt</span>
              </div>
              <app-rich-text-editor 
                #editorEn
                formControlName="fullContentEn" 
                [placeholder]="'Dán hoặc nhập nội dung bài viết tiếng Anh tại đây... Nhấn Enter để chia đoạn.'"
              ></app-rich-text-editor>
            </div>

            <!-- Vietnamese Editor -->
            <div class="space-y-4">
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Bản dịch tiếng Việt</label>
                </div>
                <span class="text-[10px] font-bold text-gray-400 italic">Căn chỉnh khớp với tiếng Anh</span>
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
        <div class="flex items-center justify-end gap-4 pb-12">
          <button type="submit" [disabled]="articleForm.invalid || loading()"
                  class="bg-primary text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
            @if (loading()) {
              <div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu thay đổi bài học
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep app-rich-text-editor .prose {
      min-height: 400px;
    }
  `]
})
export class AdminLessonArticleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private lessonEditService = inject(LessonEditService);
  
  loading = this.lessonEditService.loading;
  
  // Slugs are defined on the parent route (AdminLessonEditComponent)
  get courseSlug() { return this.route.parent?.snapshot.paramMap.get('courseSlug') || ''; }
  get lessonSlug() { return this.route.parent?.snapshot.paramMap.get('lessonSlug') || ''; }

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

  onAudioUpload(url: string) {
    this.lessonEditService.saveSection({ main_audio_url: url }).subscribe();
  }

  onSave() {
    if (this.articleForm.invalid) return;

    const enHtml = this.articleForm.get('fullContentEn')?.value || '';
    const viHtml = this.articleForm.get('fullContentVi')?.value || '';

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

    delete (payload as any).fullContentEn;
    delete (payload as any).fullContentVi;

    this.lessonEditService.saveSection(payload as any).subscribe();
  }

  private parseParagraphs(html: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let paragraphs = Array.from(doc.body.children).map(child => child.innerHTML.trim());
    if (paragraphs.length === 0 && doc.body.innerHTML.trim()) {
      paragraphs = [doc.body.innerHTML.trim()];
    }
    return paragraphs.filter(p => p !== '');
  }
}
