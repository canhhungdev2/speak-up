import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnerLayoutComponent } from '../layout/learner-layout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule, LearnerLayoutComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-learner-layout>
      <div class="p-4 md:p-8 space-y-8">
        <!-- Welcome Header -->
        <header>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white leading-tight font-outfit">Bảng điều khiển học tập 📊</h1>
          <p class="text-gray-500 dark:text-slate-400">Chào mừng trở lại! Bạn đang làm rất tốt.</p>
        </header>

        <!-- SRS & Activity Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Words Learned -->
          <div [routerLink]="['/learner/vocabulary']" class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Từ đã học</p>
                <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ wordsLearned() | number }}</h3>
              </div>
            </div>
          </div>

          <!-- Words Due (SRS) -->
          <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Đến hạn ôn</p>
                <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ wordsDue() }}</h3>
              </div>
            </div>
          </div>

          <!-- Study Time -->
          <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Thời gian học</p>
                <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ studyTime() }}m</h3>
              </div>
            </div>
          </div>

          <!-- Accuracy -->
          <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Độ chính xác</p>
                <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ accuracy() }}%</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Streak & Next Action -->
           <div class="lg:col-span-2 bg-gradient-to-br from-primary to-secondary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div class="relative z-10">
               <h2 class="text-xl font-bold opacity-80 mb-2">Tiến độ tuần</h2>
               <p class="text-5xl font-black mb-8 leading-tight font-outfit">Duy trì Streak! 🔥</p>
               <div class="flex flex-wrap gap-4">
                 <button class="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                   Tiếp tục bài học
                 </button>
                 <button class="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all">
                   Ôn tập ({{ reviews() }} từ)
                 </button>
               </div>
             </div>
             <div class="absolute right-[-20px] bottom-[-20px] opacity-10 transform rotate-12 scale-150 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
             </div>
           </div>

           <!-- 7-Day Workload Forecast -->
           <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-full">
             <h3 class="font-black text-gray-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em] mb-10 font-outfit">7-Day Workload Forecast</h3>
             
             <div class="flex-grow flex items-end justify-between gap-2 px-2 relative">
                @for (day of forecast(); track day.label) {
                  <div class="flex flex-col items-center gap-4 flex-1 group/bar relative">
                    <!-- Tooltip -->
                    @if (selectedDay() === day.label) {
                      <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap animate-bounce">
                        {{ day.count }} từ
                        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-primary rotate-45"></div>
                      </div>
                    }

                    <div (click)="selectDay(day.label)" 
                         class="w-full bg-gray-50 dark:bg-slate-800/50 rounded-full h-40 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                       <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary transition-all duration-1000" 
                            [style.height.%]="day.value">
                       </div>
                    </div>
                    <span class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">{{ day.label }}</span>
                  </div>
                }
             </div>

             <p class="text-[10px] italic text-gray-400 dark:text-slate-500 mt-10 text-center">
                Estimated number of words that will become due.
             </p>
           </div>

           <!-- Recent Discussions -->
           <div class="lg:col-span-3 bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
             <div class="flex justify-between items-center mb-8">
                <h3 class="font-bold text-gray-900 dark:text-white text-2xl font-outfit">Cộng đồng đang thảo luận</h3>
                <button class="text-primary font-bold text-sm hover:underline">Xem tất cả</button>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-start gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10 group cursor-pointer">
                   <div class="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex-shrink-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl">P</div>
                   <div>
                      <p class="font-bold text-gray-800 dark:text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors">Làm sao để phát âm từ "Schedule" chuẩn?</p>
                      <p class="text-sm text-gray-500 dark:text-slate-500">12 bình luận • 5 phút trước</p>
                   </div>
                </div>
                <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-start gap-5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10 group cursor-pointer">
                   <div class="w-14 h-14 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex-shrink-0 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black text-xl">M</div>
                   <div>
                      <p class="font-bold text-gray-800 dark:text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors">Chia sẻ mẹo nhớ 50 từ vựng mỗi ngày</p>
                      <p class="text-sm text-gray-500 dark:text-slate-500">28 bình luận • 1 giờ trước</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </app-learner-layout>
  `
})
export class LearnerDashboardComponent {
  reviews = signal(45);
  selectedDay = signal<string | null>(null);

  // Animated Stats
  wordsLearned = signal(0);
  wordsDue = signal(0);
  studyTime = signal(0);
  accuracy = signal(0);

  forecast = signal([
    { label: 'FRI', value: 5, count: 12 },
    { label: 'SAT', value: 20, count: 54 },
    { label: 'SUN', value: 10, count: 28 },
    { label: 'MON', value: 5, count: 15 },
    { label: 'TUE', value: 5, count: 10 },
    { label: 'WED', value: 5, count: 12 },
    { label: 'THU', value: 35, count: 98 },
  ]);

  constructor() {
    this.animateCount(1240, this.wordsLearned);
    this.animateCount(45, this.wordsDue);
    this.animateCount(45, this.studyTime);
    this.animateCount(92, this.accuracy);
  }

  private animateCount(target: number, signalRef: any) {
    const duration = 1500; // 1.5 seconds
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeValue * (target - start) + start);
      
      signalRef.set(currentCount);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  selectDay(label: string) {
    if (this.selectedDay() === label) {
      this.selectedDay.set(null);
    } else {
      this.selectedDay.set(label);
    }
  }
}
