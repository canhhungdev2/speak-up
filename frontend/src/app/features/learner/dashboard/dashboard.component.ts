import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VocabularyService } from '../../../core/services/vocabulary.service';
import { SupabaseService } from '../../../core/services/supabase.service';

interface ActivityDay {
  date: Date;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 md:p-10 space-y-10 bg-slate-50/50 dark:bg-transparent min-h-screen">
      
      <!-- Top Section: Welcome & Daily Goal -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <!-- Welcome Banner (8 columns) -->
        <div [class]="greetingTheme().bgClass" 
              class="lg:col-span-8 p-8 md:p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-primary/20 transition-all duration-1000 group">
            <div class="relative z-10 h-full flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-5">
                  <span class="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                    {{ greetingTheme().timeLabel }}
                  </span>
                  @if (streak() > 0) {
                    <span class="px-4 py-1.5 bg-orange-500/30 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-orange-400/20 flex items-center gap-2">
                      <span class="animate-pulse">🔥</span> {{ streak() }} Ngày liên tục
                    </span>
                  }
              </div>
              <h1 class="text-4xl md:text-5xl font-black mb-5 font-outfit tracking-tight leading-[1.2]">
                  {{ greetingTheme().message }}, <br class="hidden md:block"> {{ firstName() }}!
              </h1>
              <p class="text-base md:text-lg opacity-90 font-medium max-w-lg leading-relaxed mb-8">
                  {{ greetingTheme().subMessage }}
              </p>
              
              <div class="flex flex-wrap gap-4">
                <button routerLink="/learner/courses" class="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  HỌC TIẾP NGAY
                </button>
                <button routerLink="/learner/vocabulary/study" class="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3 relative group">
                  ÔN TẬP
                  @if (wordsDue() > 0) {
                    <span class="ml-2 px-2 py-0.5 bg-rose-500 text-[10px] rounded-full animate-pulse">
                      {{ wordsDue() }}
                    </span>
                  }
                </button>
              </div>
            </div>
            
            <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            <div class="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <div class="absolute right-10 bottom-10 opacity-20 transform rotate-12 scale-[2] pointer-events-none transition-transform group-hover:rotate-0 duration-700">
              <span class="text-9xl">{{ greetingTheme().icon }}</span>
            </div>
        </div>

        <!-- Forecast Chart (4 columns) - Replaced Daily Goal -->
        <div class="lg:col-span-4 bg-white dark:bg-[#1e293b] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="font-black text-gray-900 dark:text-white text-xl font-outfit tracking-tight">Dự báo ôn tập</h3>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">7 ngày tới</p>
            </div>
            <div class="p-2 bg-primary/10 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          
          <div class="flex items-end justify-between gap-2 h-40 relative px-1">
              @if (forecast().length === 0) {
                <div class="absolute inset-0 flex items-center justify-center">
                  <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Chưa có lịch</p>
                </div>
              }
              @for (day of forecast(); track day.label) {
                <div class="flex flex-col items-center gap-3 flex-1 group/bar relative">
                  <div (click)="selectDay(day.label)" 
                      class="w-full bg-gray-50 dark:bg-slate-800/50 rounded-full h-28 relative overflow-hidden cursor-pointer hover:ring-4 hover:ring-primary/10 transition-all">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary transition-all duration-[1.5s] rounded-full" 
                          [style.height.%]="day.value">
                    </div>
                  </div>
                  <span class="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tighter">{{ day.label }}</span>
                </div>
              }
          </div>
        </div>
      </div>

      <!-- Secondary Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (stat of stats(); track stat.label) {
            <div class="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                <div [class]="'absolute top-0 right-0 w-16 h-16 opacity-50 rounded-full blur-2xl -mr-8 -mt-8 ' + stat.colorBg"></div>
                <div class="flex flex-col gap-4 relative z-10">
                  <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm ' + stat.colorClass">
                      <span [innerHTML]="stat.icon"></span>
                  </div>
                  <div>
                      <p class="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{{ stat.label }}</p>
                      <h3 class="text-2xl font-black text-gray-900 dark:text-white font-outfit">{{ stat.value }}</h3>
                  </div>
                </div>
            </div>
          }
      </div>

      <!-- Bottom Row: Heatmap (Full Width) -->
      <div class="grid grid-cols-1 gap-10">
          <!-- Heatmap Section -->
          <div class="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h3 class="font-black text-gray-900 dark:text-white text-xl font-outfit tracking-tight">Sự kiên trì của bạn</h3>
                  <p class="text-xs text-gray-400 font-medium">Hoạt động trong 20 tuần qua</p>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 px-4 rounded-2xl">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Less</span>
                    <div class="flex gap-1.5">
                      <div class="w-4 h-4 rounded-md bg-gray-100 dark:bg-white/10"></div>
                      <div class="w-4 h-4 rounded-md bg-primary/30"></div>
                      <div class="w-4 h-4 rounded-md bg-primary/60"></div>
                      <div class="w-4 h-4 rounded-md bg-primary"></div>
                    </div>
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">More</span>
                </div>
              </div>
              <div class="overflow-x-auto scrollbar-hide pb-2 mask-fade-right">
                <div class="flex gap-2 w-max">
                    @for (week of heatmapData(); track $index) {
                      <div class="flex flex-col gap-2">
                          @for (day of week; track day.date) {
                            <div class="w-5 h-5 rounded-[0.4rem] transition-all hover:scale-125 cursor-pointer relative group/day"
                                  [class.bg-gray-100]="day.intensity === 0"
                                  [class.dark:bg-white/10]="day.intensity === 0"
                                  [class.bg-primary/30]="day.intensity === 1"
                                  [class.bg-primary/50]="day.intensity === 2"
                                  [class.bg-primary/75]="day.intensity === 3"
                                  [class.bg-primary]="day.intensity === 4">
                                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover/day:block z-50 pointer-events-none">
                                  <div class="bg-gray-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                                      {{ day.count }} Hoạt động • {{ day.date | date:'MMM d, y' }}
                                  </div>
                                  <div class="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
                                </div>
                            </div>
                          }
                      </div>
                    }
                </div>
              </div>
          </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .mask-fade-right {
      mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }
  `]
})
export class LearnerDashboardComponent implements OnInit {
  vocabService = inject(VocabularyService);
  supabaseService = inject(SupabaseService);

  newToday = signal(0);
  profile = computed(() => this.supabaseService.profile());
  
  goal = computed(() => this.profile()?.daily_goal || 10);
  streak = computed(() => this.profile()?.current_streak || 0);
  goalPercent = computed(() => Math.min((this.newToday() / this.goal()) * 100, 100));

  wordsLearned = signal(0);
  wordsDue = signal(0);
  accuracy = signal(0);
  masteredCount = signal(0);
  forecast = signal<any[]>([]);
  selectedDay = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.vocabService.getStats().subscribe(stats => {
      this.wordsLearned.set(stats.learning + stats.mastered);
      this.wordsDue.set(stats.due);
      this.accuracy.set(stats.accuracy || 0);
      this.masteredCount.set(stats.mastered);
      this.newToday.set(stats.newToday || 0);
    });

    this.vocabService.getForecast().subscribe(data => {
      if (Array.isArray(data)) {
        const maxCount = Math.max(...data.map(d => d.count), 1);
        const normalizedData = data.map(d => ({
          ...d,
          value: (d.count / maxCount) * 100
        }));
        this.forecast.set(normalizedData);
      }
    });
  }

  stats = computed(() => [
    { 
      label: 'Đã thuộc lòng', 
      value: this.masteredCount(), 
      colorClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600',
      colorBg: 'bg-emerald-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' 
    },
    { 
      label: 'Đến hạn ôn', 
      value: this.wordsDue(), 
      colorClass: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600',
      colorBg: 'bg-rose-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' 
    },
    { 
      label: 'Tổng số từ', 
      value: this.wordsLearned(), 
      colorClass: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600',
      colorBg: 'bg-indigo-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>' 
    },
    { 
      label: 'Độ chính xác', 
      value: this.accuracy() + '%', 
      colorClass: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600',
      colorBg: 'bg-amber-500',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' 
    },
  ]);

  firstName = computed(() => {
    const profile = this.supabaseService.profile();
    const name = profile?.full_name || profile?.username;
    
    if (name && name !== 'New Learner') {
      // Split by space and take the last part as the first name (Vietnamese style)
      // Or just return the whole name if no spaces
      return name.trim().split(' ').pop() || name;
    }
    
    return 'Học viên';
  });

  greetingTheme = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        bgClass: 'bg-gradient-to-br from-amber-400 to-orange-600',
        timeLabel: 'Chào buổi sáng',
        message: 'Bắt đầu ngày mới',
        subMessage: 'Một buổi sáng tuyệt vời để rèn luyện trí não. Hãy hoàn thành mục tiêu 10 từ hôm nay nhé!',
        icon: '☀️'
      };
    } else if (hour < 18) {
      return {
        bgClass: 'bg-gradient-to-br from-blue-500 to-indigo-700',
        timeLabel: 'Chào buổi chiều',
        message: 'Duy trì năng lượng',
        subMessage: 'Bạn đang đi đúng hướng rồi! Đừng quên ôn lại những từ vựng đến hạn hôm nay.',
        icon: '🌤️'
      };
    } else {
      return {
        bgClass: 'bg-gradient-to-br from-indigo-900 to-[#0f172a]',
        timeLabel: 'Chào buổi tối',
        message: 'Hoàn thành ngày học',
        subMessage: 'Thư giãn một chút và dành 10 phút cuối ngày để kiểm tra lại kiến thức nhé.',
        icon: '🌙'
      };
    }
  });

  heatmapData = signal<ActivityDay[][]>(this.generateHeatmapData());

  private generateHeatmapData(): ActivityDay[][] {
    const data: ActivityDay[][] = [];
    const today = new Date();
    for (let w = 0; w < 20; w++) {
      const week: ActivityDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + d));
        const xp = Math.floor(Math.random() * 400);
        let intensity: 0 | 1 | 2 | 3 | 4 = 0;
        if (xp > 300) intensity = 4;
        else if (xp > 200) intensity = 3;
        else if (xp > 100) intensity = 2;
        else if (xp > 20) intensity = 1;
        week.push({ date, count: xp, intensity });
      }
      data.unshift(week);
    }
    return data;
  }

  selectDay(label: string) {
    this.selectedDay.update(v => v === label ? null : label);
  }
}
