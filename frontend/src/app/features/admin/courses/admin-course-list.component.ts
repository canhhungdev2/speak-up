import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MediaUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-in fade-in duration-700">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Quản lý khóa học</h2>
              <p class="text-gray-500 dark:text-gray-400 font-medium">Danh sách toàn bộ khóa học trên hệ thống SpeakUp.</p>
            </div>
            <button routerLink="new" 
                    class="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-[1.5rem] font-bold transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tạo khóa học mới
            </button>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-4">
            <div class="flex-grow relative">
                <input type="text" 
                       placeholder="Tìm kiếm khóa học theo tiêu đề..." 
                       class="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <select class="bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3.5 px-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all font-bold">
                <option>Tất cả cấp độ</option>
                <option>Cơ bản</option>
                <option>Trung cấp</option>
                <option>Nâng cao</option>
            </select>
        </div>

        <!-- Table -->
        <div class="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 dark:bg-white/2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                            <th class="px-8 py-5">Thumbnail</th>
                            <th class="px-8 py-5">Tiêu đề khóa học</th>
                            <th class="px-8 py-5">Cấp độ</th>
                            <th class="px-8 py-5">Bài học</th>
                            <th class="px-8 py-5">Trạng thái</th>
                            <th class="px-8 py-5 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                        @for (course of courses(); track course.id) {
                            <tr class="group hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                                <td class="px-8 py-5">
                                    <div class="w-20 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                                        <img [src]="course.thumbnail | mediaUrl" class="w-full h-full object-cover" [alt]="course.title">
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ course.title }}</span>
                                        <span class="text-[10px] text-gray-400 tabular-nums">/courses/{{ course.slug }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <span class="text-sm font-bold text-gray-500 dark:text-gray-400">{{ course.level }}</span>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-black text-gray-900 dark:text-white tabular-nums">{{ course.lessons_count }}</span>
                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Bài học</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        Hoạt động
                                    </span>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button [routerLink]="['edit', course.slug]" 
                                                class="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:scale-110 transition-transform shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button (click)="deleteCourse(course)" 
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
                                        <p class="text-gray-500 dark:text-gray-400 font-bold">Chưa có khóa học nào được tạo.</p>
                                        <button routerLink="new" class="text-primary font-black uppercase text-xs tracking-widest hover:underline">Tạo khóa học đầu tiên</button>
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
  `]
})
export class AdminCourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = this.courseService.courses;

  ngOnInit() {
    this.courseService.findAll().subscribe();
  }

  deleteCourse(course: any) {
    if (confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}"? Hành động này không thể hoàn tác.`)) {
      this.courseService.delete(course.id).subscribe();
    }
  }
}
