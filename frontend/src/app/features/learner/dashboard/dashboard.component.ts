import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VocabularyService } from '../../../core/services/vocabulary.service';

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
    <div class="p-4 md:p-8 space-y-8">
      
      <!-- Dynamic Welcome Banner -->
      <div [class]="greetingTheme().bgClass" 
            class="p-8 md:p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl transition-all duration-1000">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
                <span class="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest">
                  {{ greetingTheme().timeLabel }}
                </span>
            </div>
            <h1 class="text-4xl md:text-6xl font-black mb-4 font-outfit tracking-tight leading-tight">
                {{ greetingTheme().message }}, <br class="hidden md:block"> Cảnh Hưng!
            </h1>
            <p class="text-lg opacity-80 font-medium max-w-lg leading-relaxed">
                {{ greetingTheme().subMessage }}
            </p>
          </div>
          <!-- Decorative Background Icon -->
          <div class="absolute right-[-20px] bottom-[-40px] opacity-10 transform rotate-12 scale-150 pointer-events-none">
            <span class="text-[12rem]">{{ greetingTheme().icon }}</span>
          </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Stats & Heatmap -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Core Stats Row -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                @for (stat of stats(); track stat.label) {
                  <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group">
                      <div class="flex flex-col gap-3">
                        <div [class]="stat.colorClass" class="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span [innerHTML]="stat.icon"></span>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
                            <h3 class="text-2xl font-black text-gray-900 dark:text-white">{{ stat.value }}</h3>
                        </div>
                      </div>
                  </div>
                }
            </div>

            <!-- Contribution Heatmap Card -->
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div class="flex justify-between items-center mb-8">
                  <h3 class="font-bold text-gray-900 dark:text-white text-xl font-outfit">Sự kiên trì của bạn</h3>
                  <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold text-gray-400 uppercase">Less</span>
                      <div class="flex gap-1">
                        <div class="w-3 h-3 rounded-sm bg-gray-100 dark:bg-white/5"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/20"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/40"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/70"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary"></div>
                      </div>
                      <span class="text-[10px] font-bold text-gray-400 uppercase">More</span>
                  </div>
                </div>

                <!-- Heatmap Grid -->
                <div class="overflow-x-auto scrollbar-hide pb-2">
                  <div class="flex gap-1.5 w-max">
                      @for (week of heatmapData(); track $index) {
                        <div class="flex flex-col gap-1.5">
                            @for (day of week; track day.date) {
                              <div class="w-4 h-4 rounded-sm transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer relative group/day"
                                    [class.bg-gray-100]="day.intensity === 0"
                                    [class.dark:bg-white/5]="day.intensity === 0"
                                    [class.bg-primary/20]="day.intensity === 1"
                                    [class.bg-primary/40]="day.intensity === 2"
                                    [class.bg-primary/70]="day.intensity === 3"
                                    [class.bg-primary]="day.intensity === 4">
                                  <!-- Tooltip -->
                                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/day:block z-50">
                                    <div class="bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">
                                        {{ day.count }} XP • {{ day.date | date:'MMM d' }}
                                    </div>
                                  </div>
                              </div>
                            }
                        </div>
                      }
                  </div>
                </div>
                <p class="text-[10px] text-gray-400 dark:text-slate-500 mt-6 italic">
                  Biểu đồ hiển thị hoạt động học tập của bạn trong 20 tuần qua. Đừng làm đứt chuỗi nhé!
                </p>
            </div>
          </div>

          <!-- Right Column: Goals & Forecast -->
          <div class="space-y-8">
            
            <!-- Daily Goals Progress -->
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group">
                <h3 class="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-8 font-outfit">Mục tiêu hôm nay</h3>
                
                <div class="space-y-8">
                  <!-- XP Goal -->
                  <div>
                      <div class="flex justify-between items-end mb-3">
                        <p class="font-black text-gray-900 dark:text-white">Điểm XP</p>
                        <p class="text-sm font-bold text-primary">{{ dailyXP() }} / {{ goalXP() }}</p>
                      </div>
                      <div class="h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                              [style.width.%]="(dailyXP() / goalXP()) * 100">
                        </div>
                      </div>
                  </div>

                  <!-- Lessons Goal -->
                  <div>
                      <div class="flex justify-between items-end mb-3">
                        <p class="font-black text-gray-900 dark:text-white">Bài học</p>
                        <p class="text-sm font-bold text-secondary">{{ dailyLessons() }} / {{ goalLessons() }}</p>
                      </div>
                      <div class="h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-secondary to-orange-400 rounded-full transition-all duration-1000 shadow-sm"
                              [style.width.%]="(dailyLessons() / goalLessons()) * 100">
                        </div>
                      </div>
                  </div>
                </div>

                <button class="w-full mt-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                  Học tiếp ngay
                </button>
                
                <!-- Decorative elements -->
                <div class="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <!-- 7-Day Workload Forecast -->
            <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-fit">
              <h3 class="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-10 font-outfit">Lịch ôn tập sắp tới</h3>
              
              <div class="flex items-end justify-between gap-2 px-2 h-32 relative">
                  @if (forecast().length === 0) {
                    <div class="absolute inset-0 flex items-center justify-center">
                      <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Chưa có lịch ôn tập</p>
                    </div>
                  }
                  @for (day of forecast(); track day.label) {
                    <div class="flex flex-col items-center gap-4 flex-1 group/bar relative">
                      <!-- Tooltip -->
                      <div class="absolute bottom-full mb-2 hidden group-hover/bar:block z-20">
                        <div class="bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">
                          {{ day.count }} từ
                        </div>
                      </div>
                      
                      <div (click)="selectDay(day.label)" 
                          class="w-full bg-gray-50 dark:bg-slate-800/50 rounded-full h-24 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary transition-all duration-1000 shadow-[0_-4px_10px_rgba(var(--primary-rgb),0.3)]" 
                              [style.height.%]="day.value">
                        </div>
                      </div>
                      <span class="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase">{{ day.label }}</span>
                    </div>
                  }
              </div>
            </div>
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
  `
})
export class LearnerDashboardComponent implements OnInit {
  vocabService = inject(VocabularyService);

  // Goals
  dailyXP = signal(240);
  goalXP = signal(300);
  dailyLessons = signal(2);
  goalLessons = signal(3);

  // Animated Stats
  wordsLearned = signal(0);
  wordsDue = signal(0);
  studyTime = signal(45);
  accuracy = signal(92);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load Stats
    this.vocabService.getStats().subscribe(stats => {
      this.wordsLearned.set(stats.mastered + stats.learning);
      this.wordsDue.set(stats.due);
    });

    // Load Forecast
    this.vocabService.getForecast().subscribe(data => {
      const maxCount = Math.max(...data.map(d => d.count), 1);
      const normalizedData = data.map(d => ({
        ...d,
        value: (d.count / maxCount) * 100 // Scale to percentage for bar height
      }));
      this.forecast.set(normalizedData);
    });
  }

  stats = computed(() => [
    { label: 'Từ đã học', value: this.wordsLearned(), colorClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>' },
    { label: 'Đến hạn ôn', value: this.wordsDue(), colorClass: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { label: 'Phút đã học', value: this.studyTime(), colorClass: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>' },
    { label: 'Chính xác', value: this.accuracy() + '%', colorClass: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  ]);

  greetingTheme = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        bgClass: 'bg-gradient-to-br from-amber-400 to-orange-600',
        timeLabel: 'Chào buổi sáng',
        message: 'Bắt đầu ngày mới',
        subMessage: 'Ánh nắng mặt trời đã lên, hãy dành 15 phút rèn luyện tiếng Anh để khởi đầu ngày mới thật tỉnh táo nhé!',
        icon: '☀️'
      };
    } else if (hour < 18) {
      return {
        bgClass: 'bg-gradient-to-br from-blue-500 to-indigo-700',
        timeLabel: 'Chào buổi chiều',
        message: 'Tiếp thêm năng lượng',
        subMessage: 'Bạn đang làm rất tốt! Một bài học ngắn lúc này sẽ giúp bạn duy trì sự tập trung cho phần còn lại của ngày.',
        icon: '🌤️'
      };
    } else {
      return {
        bgClass: 'bg-gradient-to-br from-indigo-900 to-[#0f172a]',
        timeLabel: 'Chào buổi tối',
        message: 'Hoàn thành ngày học',
        subMessage: 'Hãy thư giãn và ôn tập lại những gì đã học hôm nay trước khi đi ngủ. Một giấc ngủ ngon sẽ giúp não bộ ghi nhớ tốt hơn.',
        icon: '🌙'
      };
    }
  });

  heatmapData = signal<ActivityDay[][]>(this.generateHeatmapData());
  forecast = signal<any[]>([]);

  selectedDay = signal<string | null>(null);

  private generateHeatmapData(): ActivityDay[][] {
    const data: ActivityDay[][] = [];
    const today = new Date();
    // Generate 20 weeks of data
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
