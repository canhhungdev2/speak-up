import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LessonService, Lesson } from '../../../core/services/lesson.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-lesson-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
        <!-- Header -->
        <header class="flex items-center gap-6">
            <button [routerLink]="['/admin/courses', course()?.slug, 'lessons']" 
                    class="w-12 h-12 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:scale-110 active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div>
                <h2 class="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
                    {{ isEdit() ? 'Chỉnh sửa Bài học' : 'Thêm Bài học mới' }} 📝
                </h2>
                <p class="text-gray-500 dark:text-gray-400 font-medium">Khóa học: {{ course()?.title }}</p>
            </div>
        </header>

        <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Left Column: Main Info -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tiêu đề bài học</label>
                        <input type="text" formControlName="title"
                               class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Loại bài học</label>
                        <select formControlName="type"
                                class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-4 px-6 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all font-bold">
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="story">Story</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">URL Nội dung</label>
                        <input type="text" formControlName="content_url"
                               class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all">
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Thời lượng (giây)</label>
                        <input type="number" formControlName="duration"
                               class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-4 px-6 text-lg font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
                    </div>

                    <div class="pt-4 space-y-3">
                        <button type="submit" [disabled]="lessonForm.invalid"
                                class="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                            💾 Lưu bài học
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: Bilingual Content -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-xl font-black text-gray-900 dark:text-white">Nội dung song ngữ</h3>
                            <p class="text-xs text-gray-400 font-medium">Nhập lời thoại hoặc văn bản tiếng Anh và bản dịch tiếng Việt.</p>
                        </div>
                        <button type="button" (click)="addBilingualRow()"
                                class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm dòng
                        </button>
                    </div>

                    <div formArrayName="content_bilingual" class="space-y-4">
                        @for (row of contentBilingual.controls; track row; let i = $index) {
                            <div [formGroupName]="i" class="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-6 items-start group">
                                <div class="flex-grow space-y-4">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="space-y-2">
                                            <span class="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Tiếng Anh (EN)</span>
                                            <textarea formControlName="en" rows="2"
                                                      class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"></textarea>
                                        </div>
                                        <div class="space-y-2">
                                            <span class="text-[9px] font-black text-amber-500 uppercase tracking-widest ml-1">Tiếng Việt (VI)</span>
                                            <textarea formControlName="vi" rows="2"
                                                      class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" (click)="removeBilingualRow(i)"
                                        class="mt-8 p-2 text-gray-300 hover:text-rose-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        }
                    </div>

                    @if (contentBilingual.length === 0) {
                        <div class="py-12 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span class="font-bold">Chưa có nội dung song ngữ.</span>
                            <button type="button" (click)="addBilingualRow()" class="text-primary font-black uppercase text-xs tracking-widest hover:underline">Thêm dòng đầu tiên</button>
                        </div>
                    }
                </div>
            </div>
        </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminLessonEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private lessonService = inject(LessonService);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  lessonId = signal<string | null>(null);
  course = signal<Course | null>(null);

  lessonForm = this.fb.group({
    title: ['', [Validators.required]],
    type: ['video', [Validators.required]],
    content_url: [''],
    duration: [0],
    content_bilingual: this.fb.array([])
  });

  get contentBilingual() {
    return this.lessonForm.get('content_bilingual') as FormArray;
  }

  ngOnInit() {
    const courseSlug = this.route.snapshot.paramMap.get('courseSlug');
    const lessonSlug = this.route.snapshot.paramMap.get('lessonSlug');

    if (courseSlug) {
      this.courseService.findOneBySlug(courseSlug).subscribe(course => {
        this.course.set(course);
        
        if (lessonSlug) {
          this.isEdit.set(true);
          this.lessonService.findOneBySlug(courseSlug, lessonSlug).subscribe(lesson => {
            this.lessonId.set(lesson.id);
            this.lessonForm.patchValue({
              title: lesson.title,
              type: lesson.type,
              content_url: lesson.content_url,
              duration: lesson.duration
            });
            
            // Clear and fill FormArray
            this.contentBilingual.clear();
            lesson.content_bilingual?.forEach(row => this.addBilingualRow(row));
          });
        }
      });
    }
  }

  addBilingualRow(data?: { en: string, vi: string }) {
    const row = this.fb.group({
      en: [data?.en || ''],
      vi: [data?.vi || '']
    });
    this.contentBilingual.push(row);
  }

  removeBilingualRow(index: number) {
    this.contentBilingual.removeAt(index);
  }

  onSubmit() {
    if (this.lessonForm.invalid || !this.course()) return;

    const data = {
      ...this.lessonForm.value,
      course_id: this.course()?.id
    };

    if (this.isEdit()) {
      this.lessonService.update(this.lessonId()!, data).subscribe(() => {
        this.router.navigate(['/admin/courses', this.course()?.slug, 'lessons']);
      });
    } else {
      this.lessonService.create(data).subscribe(() => {
        this.router.navigate(['/admin/courses', this.course()?.slug, 'lessons']);
      });
    }
  }
}
