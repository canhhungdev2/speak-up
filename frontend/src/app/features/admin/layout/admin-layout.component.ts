import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex transition-colors duration-300">
      <!-- Admin Sidebar -->
      <aside class="w-72 bg-white dark:bg-[#1e293b] border-r border-gray-100 dark:border-white/5 flex flex-col p-6 fixed h-full z-20 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span class="font-black text-white text-xl">S</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">SpeakUp</span>
            <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] -mt-1">Admin Panel</span>
          </div>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="flex-grow space-y-2">
          @for (item of menuItems; track item.label) {
            <a [routerLink]="item.link" 
               routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20 dark:text-white"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center gap-3 p-4 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
              <div class="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform" [innerHTML]="item.icon"></div>
              <span>{{ item.label }}</span>
              @if (item.hasSub) {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              }
            </a>
          }
        </nav>

        <!-- Footer / Theme Toggle -->
        <div class="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
           <!-- Theme Toggle -->
           <button (click)="themeService.toggleTheme()" 
                   class="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              @if (themeService.isDarkMode()) {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
                <span>Chế độ sáng</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Chế độ tối</span>
              }
           </button>

           <!-- User Profile -->
           <div class="flex items-center gap-3 p-2 bg-white dark:bg-[#2e3a4e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">AD</div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-900 dark:text-white">Admin Alex</span>
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Hệ thống</span>
              </div>
              <button class="ml-auto text-gray-400 hover:text-rose-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
           </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-grow ml-72 p-10 min-h-screen">
        <!-- Top Bar -->
        <header class="flex justify-between items-center mb-10">
          <div>
            <h1 class="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Chào mừng trở lại, Cảnh Hưng! 👋</h1>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Phân tích tổng quan & Quản lý khóa học hôm nay.</p>
          </div>

          <div class="flex items-center gap-4">
             <div class="relative group">
                <button class="bg-white dark:bg-[#1e293b] p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
             </div>
             <button class="bg-white dark:bg-[#1e293b] p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
             </button>
          </div>
        </header>

        <!-- Router Outlet for Dashboard/Courses/etc -->
        <div class="relative">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminLayoutComponent {
  themeService = inject(ThemeService);

  menuItems = [
    { label: 'Bảng điều khiển', link: '/admin', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>' },
    { label: 'Quản lý người dùng', link: '/admin/users', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' },
    { label: 'Quản lý khóa học', link: '/admin/courses', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>' },
    { label: 'Phân tích', link: '/admin/analytics', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' },
    { label: 'Cài đặt', link: '/admin/settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>', hasSub: true },
    { label: 'Trợ giúp', link: '/admin/help', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  ];
}
