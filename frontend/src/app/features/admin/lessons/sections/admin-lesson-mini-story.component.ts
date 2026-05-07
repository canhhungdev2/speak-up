import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { LessonEditService } from '../lesson-edit.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminMiniStoryModalComponent } from './admin-mini-story-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-lesson-mini-story',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminMiniStoryModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in slide-in-from-right-10 duration-500">
      <form [formGroup]="msForm" (ngSubmit)="onSave()" class="space-y-8">
        <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 class="text-lg font-black">Mini Stories</h3>
                <p class="text-sm text-gray-500 font-medium">Danh sách các câu chuyện ngắn đi kèm bài học</p>
              </div>
            </div>
            <button type="button" (click)="showModal.set(true)" 
                    class="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/25">
              + Thêm Mini Story mới
            </button>
          </div>

          <div formArrayName="mini_stories" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @for (ms of stories.controls; track ms; let i = $index) {
              <div [formGroupName]="i" class="p-8 bg-gray-50 dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 relative group transition-all hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400">#{{ i + 1 }}</span>
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Story Info</span>
                  </div>
                  <div class="flex gap-1">
                    <button type="button" (click)="editStory(i)" 
                            class="p-2 text-gray-300 hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button type="button" (click)="removeStory(i)" 
                            class="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="space-y-2">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Audio URL (.mp3)</label>
                    <input type="text" formControlName="audio_url" readonly
                           class="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-4 text-[10px] font-medium text-gray-500">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Transcript (VTT URL)</label>
                    <input type="text" formControlName="vtt_url" readonly
                           class="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-4 text-[10px] font-medium text-gray-500">
                  </div>
                </div>
              </div>
            }

            @if (stories.length === 0) {
              <div class="col-span-full py-16 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-400">
                <div class="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-2xl">📽️</div>
                <p class="font-bold">Chưa có Mini Story nào.</p>
                <button type="button" (click)="showModal.set(true)" class="text-primary text-xs font-black uppercase tracking-widest hover:underline">Tạo story đầu tiên</button>
              </div>
            }
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 pb-10">
          <button type="submit" [disabled]="msForm.invalid || loading()"
                  class="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            @if (loading()) {
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            }
            Lưu Mini Stories
          </button>
        </div>
      </form>

      <!-- Mini Story Modal -->
      @if (showModal()) {
        <app-admin-mini-story-modal
          [courseSlug]="courseSlug"
          [lessonSlug]="lessonSlug"
          [nextIndex]="editingIndex() !== null ? editingIndex()! + 1 : stories.length + 1"
          [isEditMode]="editingIndex() !== null"
          [initialAudioUrl]="editingIndex() !== null ? stories.at(editingIndex()!).value.audio_url : ''"
          [initialVttUrl]="editingIndex() !== null ? stories.at(editingIndex()!).value.vtt_url : ''"
          (close)="closeModal()"
          (save)="onSaveStory($event)"
        ></app-admin-mini-story-modal>
      }
    </div>
  `,
})
export class AdminLessonMiniStoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private lessonEditService = inject(LessonEditService);
  
  loading = this.lessonEditService.loading;
  showModal = signal(false);
  editingIndex = signal<number | null>(null);

  get courseSlug() { return this.route.parent?.snapshot.paramMap.get('courseSlug') || ''; }
  get lessonSlug() { return this.route.parent?.snapshot.paramMap.get('lessonSlug') || ''; }

  msForm = this.fb.group({
    mini_stories: this.fb.array([])
  });

  get stories() { return this.msForm.get('mini_stories') as FormArray; }

  constructor() {
    this.lessonEditService.lesson$.pipe(takeUntilDestroyed()).subscribe((lesson: any) => {
      if (lesson) {
        this.stories.clear();
        lesson.mini_stories?.forEach((ms: any) => this.addStoryToForm(ms));
      }
    });
  }

  ngOnInit() {}

  addStoryToForm(data?: any) {
    this.stories.push(this.fb.group({
      id: [data?.id],
      audio_url: [data?.audio_url || '', [Validators.required]],
      vtt_url: [data?.vtt_url || '', [Validators.required]],
      order_index: [data?.order_index || 0]
    }));
  }

  editStory(index: number) {
    this.editingIndex.set(index);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingIndex.set(null);
  }

  onSaveStory(data: { audio_url: string; vtt_url: string }) {
    if (this.editingIndex() !== null) {
      // Edit mode
      const group = this.stories.at(this.editingIndex()!);
      group.patchValue({
        audio_url: data.audio_url,
        vtt_url: data.vtt_url
      });
    } else {
      // Add mode
      this.addStoryToForm({
        ...data,
        order_index: this.stories.length
      });
    }
    this.closeModal();
    this.onSave();
  }

  removeStory(index: number) { 
    if (confirm('Bạn có chắc chắn muốn xóa Mini Story này?')) {
      this.stories.removeAt(index);
      this.onSave();
    }
  }

  onSave() {
    if (this.msForm.invalid) return;
    this.lessonEditService.saveSection(this.msForm.value as any).subscribe();
  }
}
