import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from '../../../core/services/lesson.service';
import { CourseService, Course } from '../../../core/services/course.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-admin-lesson-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-in fade-in duration-700">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-6">
                <button [routerLink]="['/admin/courses']" 
                        class="w-12 h-12 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:scale-110 active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                  <h2 class="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
                    Bài học: {{ course()?.title }} 📚
                  </h2>
                  <p class="text-gray-500 dark:text-gray-400 font-medium">Quản lý danh sách bài học và thứ tự giảng dạy.</p>
                </div>
            </div>
            <button [routerLink]="['new']" 
                    class="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-[1.5rem] font-bold transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Thêm bài học mới
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 dark:bg-white/2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                            <th class="px-8 py-5 w-16"></th>
                            <th class="px-8 py-5">Thứ tự</th>
                            <th class="px-8 py-5">Tiêu đề bài học</th>
                            <th class="px-8 py-5">Loại</th>
                            <th class="px-8 py-5">Thời lượng</th>
                            <th class="px-8 py-5 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody cdkDropList (cdkDropListDropped)="onDrop($event)" class="divide-y divide-gray-50 dark:divide-white/5">
                        @for (lesson of lessons(); track lesson.id) {
                            <tr cdkDrag class="group hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors cursor-move active:bg-gray-100 dark:active:bg-white/10">
                                <td class="px-8 py-5">
                                    <div class="text-gray-300 dark:text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <span class="text-sm font-black text-gray-400 tabular-nums">#{{ $index + 1 }}</span>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ lesson.title }}</span>
                                        <span class="text-[10px] text-gray-400 tabular-nums">{{ lesson.slug }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2">
                                        <div [ngSwitch]="lesson.type" class="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <svg *ngSwitchCase="'video'" class="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10 2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z"/></svg>
                                            <svg *ngSwitchCase="'audio'" class="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.13a4.499 4.499 0 00-7 3.37c0 2.485 2.015 4.5 4.5 4.5S8 21.485 8 19V5l10-2v12.13a4.499 4.499 0 00-7 3.37c0 2.485 2.015 4.5 4.5 4.5S20 18.485 20 16V4a1 1 0 00-.5-.866z"/></svg>
                                            <svg *ngSwitchDefault class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.993 7.993 0 0112 4a8 8 0 018 8c0 4.418-3.582 8-8 8a8.001 8.001 0 01-4.5-1.413A7.993 7.993 0 014 20c-1.105 0-2-.895-2-2 0-1.105.895-2 2-2 1.105 0 2 .895 2 2h2.804A7.993 7.993 0 019 4.804z"/></svg>
                                        </div>
                                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400 capitalize">{{ lesson.type }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <span class="text-sm font-bold text-gray-500 dark:text-gray-400 tabular-nums">{{ lesson.duration }}s</span>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button [routerLink]="['edit', lesson.slug]" 
                                                class="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:scale-110 transition-transform shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button (click)="deleteLesson(lesson)" 
                                                class="p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:scale-110 transition-transform shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        } @empty {
                            <tr>
                                <td colspan="6" class="px-8 py-20 text-center">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <p class="text-gray-500 dark:text-gray-400 font-bold">Chưa có bài học nào trong khóa học này.</p>
                                        <button [routerLink]="['new']" class="text-primary font-black uppercase text-xs tracking-widest hover:underline">Thêm bài học đầu tiên</button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 1.5rem;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
      background: white;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .dark .cdk-drag-preview { background: #1e293b; border: 1px solid rgba(255,255,255,0.05); }
    .cdk-drag-placeholder { opacity: 0; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging tr:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class AdminLessonListComponent implements OnInit {
  private lessonService = inject(LessonService);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);

  course = signal<Course | null>(null);
  lessons = signal<Lesson[]>([]);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('courseSlug');
    if (slug) {
      this.courseService.findOneBySlug(slug).pipe(
        tap(course => this.course.set(course)),
        switchMap(course => this.lessonService.findAllByCourseId(course.id))
      ).subscribe(lessons => this.lessons.set(lessons));
    }
  }

  deleteLesson(lesson: Lesson) {
    if (confirm(`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?`)) {
      this.lessonService.delete(lesson.id).subscribe(() => {
        this.lessons.update(list => list.filter(l => l.id !== lesson.id));
      });
    }
  }

  onDrop(event: CdkDragDrop<Lesson[]>) {
    const lessons = [...this.lessons()];
    moveItemInArray(lessons, event.previousIndex, event.currentIndex);
    this.lessons.set(lessons);

    const orderData = lessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index + 1
    }));

    this.lessonService.reorder(orderData).subscribe({
      error: (err) => {
        console.error('Failed to reorder lessons:', err);
      }
    });
  }
}
