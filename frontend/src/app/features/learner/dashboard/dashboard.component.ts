import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnerLayoutComponent } from '../layout/learner-layout.component';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule, LearnerLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-learner-layout>
      <div class="p-8">
        <header class="mb-10">
          <h1 class="text-3xl font-black text-gray-900 dark:text-white leading-tight">Tổng quan bài học 🚀</h1>
          <p class="text-gray-500 dark:text-slate-400">Xem tiến độ và hoạt động của bạn.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Streak Card -->
           <div class="lg:col-span-2 bg-gradient-to-br from-primary to-secondary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div class="relative z-10">
               <h2 class="text-xl font-bold opacity-80 mb-2">Tiến độ tuần này</h2>
               <p class="text-5xl font-black mb-8 leading-tight font-outfit">Siêu sao học tập! 🌟</p>
               <button class="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                 Tiếp tục bài học ngay
               </button>
             </div>
             <div class="absolute right-[-20px] bottom-[-20px] opacity-10 transform rotate-12 scale-150 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
             </div>
           </div>

           <!-- Quick Stats -->
           <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
             <h3 class="font-bold text-gray-900 dark:text-white mb-8 text-xl font-outfit">Thống kê cá nhân</h3>
             <div class="space-y-8">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-slate-400 font-bold">Từ vựng mới</span>
                  <span class="font-black text-primary text-2xl">+12</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-slate-400 font-bold">Thời gian học</span>
                  <span class="font-black text-secondary text-2xl">45m</span>
                </div>
                <div class="w-full bg-gray-100 dark:bg-slate-800 h-4 rounded-full">
                  <div class="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]" style="width: 70%"></div>
                </div>
             </div>
           </div>

           <!-- Recent Discussions -->
           <div class="lg:col-span-3 bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm mt-4">
             <div class="flex justify-between items-center mb-8">
                <h3 class="font-bold text-gray-900 dark:text-white text-2xl font-outfit">Cộng đồng thảo luận</h3>
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
export class LearnerDashboardComponent {}
