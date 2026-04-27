import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 relative">
      <!-- Background Glow -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header class="mb-12">
        <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight font-outfit mb-2">Khám phá Khóa học 📚</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">Tìm kiếm lộ trình học tập phù hợp nhất với bạn.</p>
      </header>

      <!-- Categories -->
      <div class="mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <button class="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">Tất cả</button>
        <button class="px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-gray-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white transition-all shadow-sm">Cơ bản</button>
        <button class="px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-gray-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white transition-all shadow-sm">Giao tiếp</button>
      </div>

      <!-- Course Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (course of courses(); track course.id) {
        <div [routerLink]="['/learner/courses', course.slug]" class="group relative h-full">
              <div class="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              
              <div class="relative bg-white dark:bg-[#1e293b]/50 border border-gray-100 dark:border-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden hover:translate-y-[-8px] transition-all duration-500 flex flex-col h-full shadow-sm">
                <!-- Thumbnail -->
                <div class="h-56 relative overflow-hidden">
                  <img [src]="course.thumbnail" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" [alt]="course.title">
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 dark:from-[#0f172a] via-transparent to-transparent"></div>
                  <div class="absolute top-6 left-6 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 px-4 py-1.5 rounded-xl text-xs font-black text-white uppercase tracking-widest">
                      {{ course.level }}
                  </div>
                </div>

                <!-- Content -->
                <div class="p-8 space-y-4 flex-grow flex flex-col">
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors font-outfit">{{ course.title }}</h3>
                  <p class="text-gray-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                      {{ course.description }}
                  </p>

                  <div class="flex items-center gap-6 pt-6 border-t border-gray-50 dark:border-white/5">
                      <div class="flex items-center gap-2 text-gray-400 dark:text-slate-500 text-xs font-bold">
                        <span class="text-orange-500">★</span> {{ course.rating || 5.0 }}
                      </div>
                      <div class="flex items-center gap-2 text-gray-400 dark:text-slate-500 text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {{ course.lessons_count || 0 }} Bài
                      </div>
                      <button class="ml-auto w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-600 dark:text-white hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-95 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                  </div>
                </div>
              </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = this.courseService.courses;

  ngOnInit() {
    this.courseService.findAll().subscribe();
  }
}
