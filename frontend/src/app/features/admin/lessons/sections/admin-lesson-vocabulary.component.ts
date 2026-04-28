import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonEditService } from '../lesson-edit.service';
import { VocabularyService, Vocabulary } from '../../../../core/services/vocabulary.service';
import { DictionaryService } from '../../../../core/services/dictionary.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminAudioUploadComponent } from '../../../../shared/components/admin-audio-upload.component';

@Component({
  selector: 'app-admin-lesson-vocabulary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminAudioUploadComponent],
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
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tải lên Audio Từ vựng</label>
            <app-admin-audio-upload 
              formControlName="vocab_audio_url"
              [courseSlug]="courseSlug"
              [lessonSlug]="lessonSlug"
              [customName]="'Vocabulary'"
              (uploadSuccess)="onAudioUpload($event)"
            ></app-admin-audio-upload>
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

          <!-- Modern Modal Overlay -->
          @if (showForm()) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div class="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                <!-- Modal Header -->
                <div class="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <h3 class="text-xl font-black text-gray-900 dark:text-white">
                    {{ editingVocab() ? 'Edit Word' : 'Add New Word' }}
                  </h3>
                  <button (click)="closeForm()" class="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form [formGroup]="wordForm" (ngSubmit)="onWordSubmit()" class="p-8 space-y-6">
                  <!-- Word / Phrase Row -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Word / Phrase</label>
                      <button type="button" (click)="fetchDetails()" [disabled]="isFetching()"
                              class="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black border border-emerald-100 dark:border-emerald-500/20 hover:scale-105 transition-all">
                        @if (isFetching()) {
                          <div class="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        } @else {
                          <span>✨ Auto Fetch Info</span>
                        }
                      </button>
                    </div>
                    <input type="text" formControlName="term" placeholder="Enter word or phrase"
                           class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none">
                  </div>

                  <!-- Phonetic & Word Type Row -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Phonetic</label>
                      <input type="text" formControlName="ipa" placeholder="/ɡreɪv/"
                             [class.ring-2]="isAutoFilled()" [class.ring-emerald-500/30]="isAutoFilled()"
                             class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Word Type</label>
                      <input type="text" formControlName="word_type" placeholder="noun, verb..."
                             [class.ring-2]="isAutoFilled()" [class.ring-emerald-500/30]="isAutoFilled()"
                             class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/20 transition-all outline-none">
                    </div>
                  </div>

                  <!-- Audio URL Row (Full Width) -->
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Audio URL</label>
                    <div class="relative flex items-center gap-2">
                      <input type="text" formControlName="audio_url" placeholder="https://..."
                             class="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs focus:ring-4 focus:ring-primary/20 transition-all outline-none">
                      <button type="button" 
                              (click)="wordForm.get('audio_url')?.value ? playAudio(wordForm.get('audio_url')?.value) : null"
                              [disabled]="!wordForm.get('audio_url')?.value"
                              class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-2xl border border-slate-200 dark:border-slate-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      </button>
                    </div>
                  </div>

                  <!-- Translation (Vietnamese) -->
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Translation (Vietnamese)</label>
                    <input type="text" formControlName="definition_vi" placeholder="Vietnamese meaning"
                           class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/20 transition-all outline-none">
                  </div>

                  <!-- Example Sentence -->
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">Example Sentence</label>
                    <textarea formControlName="example" rows="3" placeholder="Example usage in context..."
                              class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/20 transition-all outline-none resize-none"></textarea>
                  </div>

                  <!-- Modal Footer -->
                  <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5 mt-4">
                    <button type="button" (click)="closeForm()" 
                            class="px-8 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
                      Cancel
                    </button>
                    <button type="submit" [disabled]="wordForm.invalid" 
                            class="px-10 py-3 bg-[#e11d48] text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all">
                      Save & Close
                    </button>
                  </div>
                </form>
              </div>
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
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Định nghĩa (EN)</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nghĩa (VI)</th>
                  <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                @for (v of vocabularies(); track v.id) {
                  <tr class="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <span class="font-bold text-gray-900 dark:text-white">{{ v.term }}</span>
                        @if (v.audio_url) {
                          <button type="button" (click)="playAudio(v.audio_url)" 
                                  class="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                          </button>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 italic">{{ v.ipa }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-black uppercase tracking-tight">{{ v.word_type }}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-[200px]">
                      <div class="line-clamp-2" [title]="v.definition">{{ v.definition }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400 font-bold max-w-[200px]">
                      <div class="line-clamp-2" [title]="v.definition_vi">{{ v.definition_vi }}</div>
                    </td>
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
  private route = inject(ActivatedRoute);
  private lessonEditService = inject(LessonEditService);
  private vocabularyService = inject(VocabularyService);
  private dictionaryService = inject(DictionaryService);
  
  loading = this.lessonEditService.loading;
  vocabularies = signal<Vocabulary[]>([]);
  showForm = signal(false);
  editingVocab = signal<Vocabulary | null>(null);
  isFetching = signal(false);
  isAutoFilled = signal(false);

  get courseSlug() { return this.route.parent?.snapshot.paramMap.get('courseSlug') || ''; }
  get lessonSlug() { return this.route.parent?.snapshot.paramMap.get('lessonSlug') || ''; }

  vocabForm = this.fb.group({
    vocab_audio_url: ['']
  });

  wordForm = this.fb.group({
    term: ['', [Validators.required]],
    ipa: [''],
    definition: ['', [Validators.required]],
    definition_vi: [''],
    example: [''],
    word_type: [''],
    audio_url: ['']
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
    this.wordForm.reset({ word_type: '', audio_url: '' });
    this.isAutoFilled.set(false);
    this.showForm.set(true);
  }

  editWord(v: Vocabulary) {
    this.editingVocab.set(v);
    this.wordForm.patchValue(v);
    this.isAutoFilled.set(false);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingVocab.set(null);
    this.isAutoFilled.set(false);
  }

  fetchDetails() {
    const term = this.wordForm.get('term')?.value;
    if (!term) return;

    this.isFetching.set(true);
    this.dictionaryService.fetchWordDetails(term).subscribe(details => {
      this.isFetching.set(false);
      if (details) {
        // Map part of speech
        const pos = details.meanings[0]?.partOfSpeech;
        let wordType = 'noun';
        if (pos?.includes('verb')) wordType = 'verb';
        else if (pos?.includes('adjective')) wordType = 'adj';
        else if (pos?.includes('adverb')) wordType = 'adv';

        // Find first valid audio URL
        const audio = details.phonetics.find(p => p.audio && p.audio.length > 0)?.audio || '';

        this.wordForm.patchValue({
          ipa: details.phonetic || details.phonetics.find(p => p.text)?.text || '',
          word_type: pos || 'noun',
          definition: details.meanings[0]?.definitions[0]?.definition || '',
          definition_vi: details.definition_vi || '',
          example: details.meanings[0]?.definitions[0]?.example || '',
          audio_url: audio
        });
        this.isAutoFilled.set(true);
      } else {
        alert('Không tìm thấy thông tin từ vựng này.');
      }
    });
  }

  playAudio(url: any) {
    if (!url) return;
    try {
      const audio = new Audio(url);
      audio.play().catch(err => console.error('Audio playback failed:', err));
    } catch (e) {
      console.error('Error creating audio object:', e);
    }
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

  onAudioUpload(url: string) {
    this.lessonEditService.saveSection({ vocab_audio_url: url }).subscribe();
  }

  onSave() {
    if (this.vocabForm.invalid) return;
    this.lessonEditService.saveSection(this.vocabForm.value as any).subscribe();
  }
}
