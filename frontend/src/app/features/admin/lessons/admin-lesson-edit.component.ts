import { Component, ChangeDetectionStrategy, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LessonEditService } from './lesson-edit.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { LessonService } from '../../../core/services/lesson.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-lesson-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  providers: [LessonEditService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-in fade-in duration-500">
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-6">
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
        </div>

        @if (isEdit()) {
          <div class="flex items-center gap-3 bg-white/50 dark:bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-gray-100 dark:border-white/5">
             <span class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {{ lesson()?.id?.split('-')?.[0] }}</span>
          </div>
        }
      </header>

      @if (!isEdit()) {
        <!-- Simple Create Form -->
        <div class="max-w-2xl bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl">
          <form [formGroup]="createForm" (ngSubmit)="onCreate()" class="space-y-6">
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tiêu đề bài học</label>
              <input type="text" formControlName="title" placeholder="Ví dụ: A Day in the Life"
                     class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-5 px-8 text-2xl font-black text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all">
            </div>
            <button type="submit" [disabled]="createForm.invalid || loading()"
                    class="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              @if (loading()) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang tạo...
              } @else {
                Tạo bài học & Tiếp tục 🚀
              }
            </button>
          </form>
        </div>
      } @else {
        <!-- Tabbed Navigation -->
        <nav class="flex flex-wrap gap-2 p-1.5 bg-gray-100/50 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-white/5">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="[tab.path]"
               routerLinkActive="bg-white dark:bg-primary text-primary dark:text-white shadow-lg"
               [routerLinkActiveOptions]="{exact: false}"
               class="flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all transition-colors duration-300">
              <span class="text-xl" [innerHTML]="tab.icon"></span>
              {{ tab.label }}
            </a>
          }
        </nav>

        <!-- Main Content Area -->
        <main class="min-h-[600px] relative">
          @if (lessonLoading()) {
            <div class="absolute inset-0 flex items-center justify-center z-10">
              <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          }
          <div [class.opacity-50]="lessonLoading()" class="transition-opacity duration-300">
            <router-outlet></router-outlet>
          </div>
        </main>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .active-tab {
      background: white;
      color: var(--primary-color);
      box-shadow: 0 4px 20px -5px rgba(0,0,0,0.1);
    }
    .dark .active-tab {
      background: #3b82f6;
      color: white;
    }
  `]
})
export class AdminLessonEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lessonEditService = inject(LessonEditService);
  private courseService = inject(CourseService);
  private lessonService = inject(LessonService);
  private fb = inject(FormBuilder);

  isEdit = signal(false);
  course = signal<Course | null>(null);
  lesson = this.lessonEditService.lesson;
  lessonLoading = this.lessonEditService.loading;
  loading = signal(false);

  createForm = this.fb.group({
    title: ['', [Validators.required]]
  });

  tabs = [
    { path: 'article', label: 'Bài học chính', icon: '📝' },
    { path: 'vocabulary', label: 'Từ vựng', icon: '📚' },
    { path: 'mini-story', label: 'Mini Story', icon: '🎬' },
    { path: 'pov', label: 'Góc nhìn', icon: '🎯' },
    { path: 'commentary', label: 'Bình luận', icon: '💬' },
  ];

  ngOnInit() {
    const courseSlug = this.route.snapshot.paramMap.get('courseSlug');
    const lessonSlug = this.route.snapshot.paramMap.get('lessonSlug');

    if (courseSlug) {
      this.courseService.findOneBySlug(courseSlug).subscribe(course => {
        this.course.set(course);
        if (lessonSlug) {
          this.isEdit.set(true);
          this.lessonEditService.loadLesson(courseSlug, lessonSlug).subscribe();
        }
      });
    }
  }

  ngOnDestroy() {
    this.lessonEditService.clear();
  }

  onCreate() {
    if (this.createForm.invalid || !this.course()) return;
    this.loading.set(true);
    const data = { 
      ...this.createForm.value, 
      course_id: this.course()?.id 
    };
    
    this.lessonService.create(data).subscribe({
      next: (lesson) => {
        this.loading.set(false);
        this.router.navigate(['/admin/courses', this.course()?.slug, 'lessons', 'edit', lesson.slug]);
      },
      error: () => this.loading.set(false)
    });
  }
}
