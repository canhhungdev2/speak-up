import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { VocabularyService, Vocabulary } from '../../../../core/services/vocabulary.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-lesson-vocabulary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500">
      <form [formGroup]="vocabForm" (ngSubmit)="onSave()" class="space-y-8">
        <!-- Audio Settings -->
        <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 000-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <div>
              <h3 class="text-lg font-black">Audio từ vựng</h3>
              <p class="text-sm text-gray-500 font-medium">Cấu hình audio tổng quan cho phần từ vựng</p>
            </div>
          </div>
          
          <div class="max-w-2xl space-y-2">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vocabulary Audio URL (.mp3)</label>
            <input type="text" formControlName="vocab_audio_url"
                   class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-xl py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all">
          </div>
        </div>

        <!-- Vocabulary List -->
        <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
           <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                <h3 class="text-lg font-black">Danh sách từ vựng</h3>
                <p class="text-sm text-gray-500 font-medium">Quản lý chi tiết từng từ, nghĩa và ví dụ</p>
              </div>
            </div>
            <button type="button" (click)="openAddForm()" 
                    class="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/25">
              + Thêm từ mới
            </button>
          </div>

          <!-- Add/Edit Form Overlay -->
          @if (showForm()) {
            <div class="mb-8 p-8 bg-gray-50 dark:bg-white/2 rounded-[2rem] border-2 border-primary/20 animate-in zoom-in-95 duration-300">
              <h4 class="text-sm font-black uppercase tracking-widest mb-6 text-primary">
                {{ editingVocab() ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới' }}
              </h4>
              <form [formGroup]="wordForm" (ngSubmit)="onWordSubmit()" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Từ vựng</label>
                    <input type="text" formControlName="term" class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm font-bold">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Phiên âm (IPA)</label>
                    <input type="text" formControlName="ipa" class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Loại từ</label>
                    <select formControlName="word_type" class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm appearance-none">
                      <option value="noun">Danh từ (n)</option>
                      <option value="verb">Động từ (v)</option>
                      <option value="adj">Tính từ (adj)</option>
                      <option value="adv">Trạng từ (adv)</option>
                      <option value="phrase">Cụm từ (phrase)</option>
                    </select>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Định nghĩa</label>
                    <textarea formControlName="definition" rows="2" class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm"></textarea>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase ml-1">Ví dụ</label>
                    <textarea formControlName="example" rows="2" class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm"></textarea>
                  </div>
                </div>
                <div class="flex justify-end gap-3 pt-4">
                  <button type="button" (click)="closeForm()" class="px-6 py-3 text-gray-500 font-bold text-xs uppercase">Hủy bỏ</button>
                  <button type="submit" [disabled]="wordForm.invalid" 
                          class="px-8 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                    {{ editingVocab() ? 'Cập nhật' : 'Xác nhận thêm' }}
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Table -->
          <div class="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 dark:bg-white/5">
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Từ vựng</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phiên âm</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại từ</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Định nghĩa</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                @for (v of vocabularies(); track v.id) {
                  <tr class="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ v.term }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ v.ipa }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-black uppercase">{{ v.word_type }}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{{ v.definition }}</td>
                    <td class="px-6 py-4">
                       <div class="flex items-center gap-2">
                        <button type="button" (click)="editWord(v)" class="p-2 text-gray-400 hover:text-primary transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button type="button" (click)="deleteWord(v.id)" class="p-2 text-gray-400 hover:text-rose-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                       </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">Chưa có từ vựng nào được thêm vào bài học này.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 pb-10">
          <button type="submit" [disabled]="vocabForm.invalid || loading()"
                  class="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu cài đặt Audio
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AdminLessonVocabularyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonEditService = inject(LessonEditService);
  private vocabularyService = inject(VocabularyService);
  
  loading = this.lessonEditService.loading;
  vocabularies = signal<Vocabulary[]>([]);
  showForm = signal(false);
  editingVocab = signal<Vocabulary | null>(null);

  vocabForm = this.fb.group({
    vocab_audio_url: ['']
  });

  wordForm = this.fb.group({
    term: ['', [Validators.required]],
    ipa: [''],
    definition: ['', [Validators.required]],
    example: [''],
    word_type: ['noun']
  });

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.vocabForm.patchValue({
          vocab_audio_url: lesson.vocab_audio_url
        });
        this.loadVocabularies(lesson.id);
      }
    });
  }

  ngOnInit() {}

  loadVocabularies(lessonId: string) {
    this.vocabularyService.findByLesson(lessonId).subscribe(list => {
      this.vocabularies.set(list);
    });
  }

  openAddForm() {
    this.editingVocab.set(null);
    this.wordForm.reset({ word_type: 'noun' });
    this.showForm.set(true);
  }

  editWord(v: Vocabulary) {
    this.editingVocab.set(v);
    this.wordForm.patchValue(v);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingVocab.set(null);
  }

  onWordSubmit() {
    if (this.wordForm.invalid) return;
    const lessonId = this.lessonEditService.lesson()?.id;
    if (!lessonId) return;

    const data = { ...this.wordForm.value, lesson_id: lessonId };
    const editId = this.editingVocab()?.id;

    if (editId) {
      this.vocabularyService.update(editId, data as any).subscribe(() => {
        this.loadVocabularies(lessonId);
        this.closeForm();
      });
    } else {
      this.vocabularyService.create(data as any).subscribe(() => {
        this.loadVocabularies(lessonId);
        this.closeForm();
      });
    }
  }

  deleteWord(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) return;
    this.vocabularyService.delete(id).subscribe(() => {
      const lessonId = this.lessonEditService.lesson()?.id;
      if (lessonId) this.loadVocabularies(lessonId);
    });
  }

  onSave() {
    if (this.vocabForm.invalid) return;
    this.lessonEditService.saveSection(this.vocabForm.value as any).subscribe();
  }
}
