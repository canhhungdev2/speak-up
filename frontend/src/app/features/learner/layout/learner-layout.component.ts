import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-learner-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex transition-colors duration-500 font-sans">
      
      <!-- Sidebar (Restored Original Style) -->
      <aside [class.translate-x-0]="isMobileMenuOpen()" 
             class="fixed md:sticky top-0 left-0 w-72 h-screen bg-white dark:bg-[#1e293b]/50 dark:backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col p-8 z-[100] transition-transform md:translate-x-0 -translate-x-full">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <span class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter font-outfit">SpeakUp</span>
        </div>

        <!-- Navigation Groups -->
        <div class="space-y-8 flex-grow overflow-y-auto pr-2 scrollbar-hide">
          <div>
            <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Menu Chính</p>
            <nav class="space-y-2">
              <a routerLink="/learner" routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20" [routerLinkActiveOptions]="{exact: true}"
                 class="flex items-center gap-4 px-4 py-3.5 text-gray-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                 </svg>
                 Dashboard
              </a>
              <a routerLink="/learner/courses" routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20"
                 class="flex items-center gap-4 px-4 py-3.5 text-gray-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
                 Khóa học
              </a>
              <a routerLink="/learner/vocabulary" routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20"
                 class="flex items-center gap-4 px-4 py-3.5 text-gray-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
                 Từ vựng
              </a>
            </nav>
          </div>

          <div>
            <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Cộng đồng</p>
            <nav class="space-y-2">
              <a href="#" class="flex items-center gap-4 px-4 py-3.5 text-gray-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 Diễn đàn
              </a>
            </nav>
          </div>
        </div>

        <!-- Theme Toggle & Profile Footer -->
        <div class="pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
           <button (click)="themeService.toggleTheme()" 
                   class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group">
             <span class="text-sm font-bold text-gray-600 dark:text-slate-300">Chế độ tối</span>
             <div class="w-12 h-6 bg-gray-200 dark:bg-primary/20 rounded-full relative transition-colors">
                <div [class.translate-x-6]="themeService.isDarkMode()" 
                     class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-primary shadow-sm transition-transform"></div>
             </div>
           </button>
           
           <div class="flex items-center gap-4 p-2">
              <div class="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl p-[2px]">
                 <div class="w-full h-full bg-white dark:bg-[#1e293b] rounded-[14px] flex items-center justify-center">
                    <span class="text-sm font-black text-primary">CH</span>
                 </div>
              </div>
              <div>
                 <p class="text-sm font-black text-gray-900 dark:text-white">Cảnh Hưng</p>
                 <p class="text-[10px] font-bold text-primary uppercase">Cấp độ 5</p>
              </div>
           </div>
        </div>
      </aside>

      <!-- Main Layout -->
      <div class="flex-grow flex flex-col min-w-0">
        <!-- Header -->
        <header class="h-24 px-8 flex justify-between items-center bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-[50] border-b border-gray-100 dark:border-white/5">
           <!-- Search Bar -->
           <div class="relative w-full max-w-md hidden md:block">
              <input type="text" placeholder="Tìm kiếm bài học..." 
                     class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-primary/30 outline-none transition-all text-gray-900 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>

           <!-- Mobile Menu Toggle -->
           <button (click)="toggleMobileMenu()" class="md:hidden p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
           </button>

           <!-- Actions -->
           <div class="flex items-center gap-4">
              <button class="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-600 dark:text-slate-400 relative">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                 </svg>
                 <span class="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-[#0f172a]"></span>
              </button>
              <div class="h-8 w-[1px] bg-gray-200 dark:bg-white/10"></div>
              <div class="hidden sm:flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-gray-100 dark:border-white/5">
                 <span class="text-orange-500 font-black">🔥 5</span>
                 <span class="text-primary font-black">💎 1,250</span>
              </div>
           </div>
        </header>

        <!-- Dynamic Content -->
        <main class="flex-grow">
           <ng-content></ng-content>
        </main>
      </div>

      <!-- Mobile Overlay -->
      <div *ngIf="isMobileMenuOpen()" 
           (click)="toggleMobileMenu()"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] md:hidden"></div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class LearnerLayoutComponent {
  themeService = inject(ThemeService);
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
