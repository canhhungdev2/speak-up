import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <!-- Mobile Header -->
      <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="text-white font-bold text-sm">S</span>
          </div>
          <span class="text-xl font-black text-gray-900 tracking-tight">SpeakUp</span>
        </div>
        <button (click)="toggleMobileMenu()" class="p-2 text-gray-600">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      <!-- Sidebar (Desktop & Mobile Overlay) -->
      <aside [class.hidden]="!isMobileMenuOpen() && !isDesktop()" 
             class="fixed md:sticky top-0 left-0 w-full md:w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 z-[60] md:z-auto transition-all">
        <div class="flex justify-between items-center mb-10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="text-xl font-black text-gray-900 tracking-tight">SpeakUp</span>
          </div>
          <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav class="flex-grow space-y-2">
          <a href="#" class="flex items-center gap-3 p-3 bg-primary-light text-primary font-bold rounded-xl">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Tổng quan
          </a>
          <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Khóa học
          </a>
          <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cộng đồng
          </a>
        </nav>

        <div class="mt-auto pt-6 border-t border-gray-100">
           <div class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div class="flex-grow">
                 <p class="text-sm font-bold text-gray-900">Người học</p>
                 <p class="text-xs text-gray-500">Cấp độ 5</p>
              </div>
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow p-4 md:p-8">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-gray-900 leading-tight">Chào mừng bạn trở lại! 👋</h1>
            <p class="text-gray-500">Tiếp tục hành trình chinh phục tiếng Anh của bạn.</p>
          </div>
          <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 px-4 self-stretch md:self-auto">
            <span class="text-orange-500 font-bold">🔥 5 ngày</span>
            <div class="h-8 w-px bg-gray-100"></div>
            <span class="text-primary font-bold">💎 1,250 EXP</span>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
           <!-- Streak Card -->
           <div class="lg:col-span-2 bg-gradient-to-br from-primary to-secondary p-6 md:p-8 rounded-[2rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div class="relative z-10">
               <h2 class="text-lg md:text-xl font-bold opacity-80 mb-2 font-outfit">Tiến độ tuần này</h2>
               <p class="text-3xl md:text-5xl font-black mb-6 leading-tight">Siêu sao học tập! 🌟</p>
               <button class="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                 Tiếp tục bài học
               </button>
             </div>
             <div class="absolute right-[-40px] bottom-[-40px] opacity-20 transform rotate-12 scale-150 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                </svg>
             </div>
           </div>

           <!-- Statistics -->
           <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
             <h3 class="font-bold text-gray-900 mb-6 text-lg">Thống kê cá nhân</h3>
             <div class="space-y-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 font-medium">Từ vựng mới</span>
                  <span class="font-black text-primary text-lg">+12</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 font-medium">Thời gian học</span>
                  <span class="font-black text-secondary text-lg">45m</span>
                </div>
                <div class="w-full bg-gray-100 h-3 rounded-full mt-4">
                  <div class="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" style="width: 70%"></div>
                </div>
             </div>
           </div>

           <!-- Community Section -->
           <div class="lg:col-span-3 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
             <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-gray-900 text-xl font-outfit">Cộng đồng thảo luận</h3>
                <button class="text-primary font-bold text-sm hover:underline">Tham gia ngay</button>
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-5 bg-gray-50 rounded-2xl flex items-start gap-4 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                   <div class="w-12 h-12 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">S</div>
                   <div>
                      <p class="font-bold text-gray-800 leading-tight mb-1">Làm sao để phát âm từ "Schedule" chuẩn?</p>
                      <p class="text-xs text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        12 bình luận • 5 phút trước
                      </p>
                   </div>
                </div>
                <div class="p-5 bg-gray-50 rounded-2xl flex items-start gap-4 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                   <div class="w-12 h-12 bg-rose-100 rounded-full flex-shrink-0 flex items-center justify-center text-rose-600 font-bold">V</div>
                   <div>
                      <p class="font-bold text-gray-800 leading-tight mb-1">Chia sẻ mẹo nhớ 50 từ vựng mỗi ngày</p>
                      <p class="text-xs text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        28 bình luận • 1 giờ trước
                      </p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </main>
    </div>
  `
})
export class LearnerDashboardComponent {
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  isDesktop() {
    return window.innerWidth >= 768;
  }
}
