import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        <div class="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white font-outfit">Quản lý khóa học</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Xem và cập nhật trạng thái các khóa học hiện có.</p>
            </div>
            <button class="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                + Thêm khóa học
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50/50 dark:bg-white/2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        <th class="px-8 py-5">Ảnh đại diện</th>
                        <th class="px-8 py-5">Tên khóa học</th>
                        <th class="px-8 py-5">Danh mục</th>
                        <th class="px-8 py-5">Trạng thái</th>
                        <th class="px-8 py-5">Học viên</th>
                        <th class="px-8 py-5 text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                    @for (course of courses(); track course.id) {
                        <tr class="group hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                            <td class="px-8 py-5">
                                <div class="w-16 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <img [src]="course.thumbnail" class="w-full h-full object-cover" [alt]="course.title">
                                </div>
                            </td>
                            <td class="px-8 py-5">
                                <span class="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ course.title }}</span>
                            </td>
                            <td class="px-8 py-5">
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ course.level }}</span>
                            </td>
                            <td class="px-8 py-5">
                                <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                      [ngClass]="statusClass(course.status)">
                                    {{ course.status || 'Đã xuất bản' }}
                                </span>
                            </td>
                            <td class="px-8 py-5 text-gray-500 dark:text-gray-400 font-bold tabular-nums">
                                {{ course.enrollment || 120 }}
                            </td>
                            <td class="px-8 py-5 text-right">
                                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button class="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    </div>
  `
})
export class CourseTableComponent {
  courses = input.required<any[]>();

  statusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'bản nháp':
      case 'draft':
        return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10';
      case 'lưu trữ':
      case 'archived':
        return 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      default:
        return 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    }
  }
}
