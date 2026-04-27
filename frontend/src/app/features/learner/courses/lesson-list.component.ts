import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MediaUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-10 max-w-5xl mx-auto">
      <!-- Course Header -->
      <div class="relative rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
          <img [src]="course().thumbnail | mediaUrl" class="w-full h-80 object-cover opacity-80" [alt]="course().title">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div class="absolute bottom-10 left-10 right-10">
            <div class="flex items-center gap-3 mb-4">
                <span class="px-4 py-1 bg-primary text-white text-xs font-black rounded-full uppercase tracking-widest">
                  {{ course().level }}
                </span>
                <span class="text-white/60 text-sm font-bold">{{ course().lessons.length }} Bài học</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-white font-outfit mb-4">{{ course().title }}</h1>
            <div class="flex items-center gap-6">
                <div class="flex-grow max-w-xs h-2 bg-white/20 rounded-full overflow-hidden">
                  <div class="bg-primary h-full rounded-full" [style.width.%]="40"></div>
                </div>
                <span class="text-white font-bold">40% Hoàn thành</span>
            </div>
          </div>
      </div>

      <!-- Lessons List -->
      <div class="space-y-4">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-6 font-outfit">Danh sách bài học</h2>
          
          @for (lesson of course().lessons; track lesson.id) {
            <div class="group relative">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div class="relative bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex items-center gap-6 hover:shadow-xl transition-all cursor-pointer">
                  <!-- Lesson Number -->
                  <div class="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xl font-black text-gray-400 group-hover:text-primary transition-colors">
                    {{ lesson.order_index }}
                  </div>

                  <!-- Lesson Info -->
                  <div class="flex-grow">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ lesson.title }}</h3>
                    <div class="flex items-center gap-4 mt-1">
                        <span class="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {{ lesson.type }}
                        </span>
                        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ lesson.duration }}</span>
                    </div>
                  </div>

                  <!-- Status / Action -->
                  <div>
                    @if (lesson.completed) {
                      <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                      </div>
                    } @else {
                      <button [routerLink]="['/learner/courses', course().slug, 'lessons', lesson.slug]" 
                              class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        Học ngay
                      </button>
                    }
                  </div>
              </div>
            </div>
          }
      </div>
    </div>
  `
})
export class LessonListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  
  course = signal<any>({
    title: 'Loading...',
    lessons: []
  });

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('courseSlug');
    if (slug) {
      this.courseService.findOneBySlug(slug).subscribe(course => {
        this.course.set(course);
      });
    }
  }
}
