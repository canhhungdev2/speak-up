import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex transition-colors duration-300">
      <!-- Admin Sidebar -->
      <aside 
        [class.w-72]="!isSidebarCollapsed()"
        [class.w-24]="isSidebarCollapsed()"
        class="bg-white dark:bg-[#1e293b] border-r border-gray-100 dark:border-white/5 flex flex-col p-6 fixed h-full z-20 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500 ease-in-out overflow-hidden">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12 shrink-0">
          <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
            <span class="font-black text-white text-xl">S</span>
          </div>
          <div class="flex flex-col transition-all duration-300" [class.opacity-0]="isSidebarCollapsed()" [class.translate-x-[-20px]]="isSidebarCollapsed()">
            <span class="text-xl font-black text-gray-900 dark:text-white font-outfit tracking-tight whitespace-nowrap">SpeakUp</span>
            <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] -mt-1 whitespace-nowrap">Admin Panel</span>
          </div>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="flex-grow space-y-2">
          @for (item of menuItems; track item.label) {
            <a [routerLink]="item.link" 
               routerLinkActive="bg-primary/10 text-primary dark:bg-primary/20 dark:text-white shadow-sm"
               [routerLinkActiveOptions]="{exact: true}"
               [title]="item.label"
               class="flex items-center gap-3 p-4 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group overflow-hidden">
              <div class="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0" [innerHTML]="item.icon"></div>
              <span class="transition-all duration-300 whitespace-nowrap" [class.opacity-0]="isSidebarCollapsed()" [class.translate-x-[-10px]]="isSidebarCollapsed()">
                {{ item.label }}
              </span>
              @if (item.hasSub && !isSidebarCollapsed()) {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              }
            </a>
          }
        </nav>

        <!-- Footer / Theme Toggle -->
        <div class="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4 shrink-0">
           <!-- Theme Toggle -->
           <button (click)="themeService.toggleTheme()" 
                   class="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all overflow-hidden">
              <div class="shrink-0">
                @if (themeService.isDarkMode()) {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                }
              </div>
              <span class="transition-all duration-300 whitespace-nowrap" [class.opacity-0]="isSidebarCollapsed()" [class.translate-x-[-10px]]="isSidebarCollapsed()">
                {{ themeService.isDarkMode() ? 'Sáng' : 'Tối' }}
              </span>
           </button>

           <!-- User Profile -->
           <div class="flex items-center gap-3 p-2 bg-white dark:bg-[#2e3a4e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black shrink-0 overflow-hidden">
                 <img *ngIf="supabaseService.currentUser()?.user_metadata?.['avatar_url']" 
                      [src]="supabaseService.currentUser()?.user_metadata?.['avatar_url']" 
                      class="w-full h-full object-cover">
                 <span *ngIf="!supabaseService.currentUser()?.user_metadata?.['avatar_url']">{{ getUserInitials() }}</span>
              </div>
              <div class="flex flex-col transition-all duration-300" [class.opacity-0]="isSidebarCollapsed()" [class.translate-x-[-10px]]="isSidebarCollapsed()">
                <span class="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">{{ supabaseService.currentUser()?.user_metadata?.['full_name'] || 'Admin User' }}</span>
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap">Hệ thống</span>
              </div>
           </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main 
        [class.ml-72]="!isSidebarCollapsed()"
        [class.ml-24]="isSidebarCollapsed()"
        class="flex-grow p-10 min-h-screen transition-all duration-500 ease-in-out">
        
        <!-- Top Bar -->
        <header class="flex justify-between items-center mb-10">
          <div class="flex items-center gap-6">
            <button (click)="toggleSidebar()" 
                    class="p-3 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-gray-500 hover:text-primary transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="isSidebarCollapsed() ? 'M4 6h16M4 12h16M4 18h16' : 'M4 6h16M4 12h10M4 18h16'" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Chào mừng trở lại, {{ getFirstName() }}! 👋</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Hệ thống quản lý SpeakUp đang vận hành ổn định.</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
             <div class="relative group hidden md:block">
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
  supabaseService = inject(SupabaseService);
  sanitizer = inject(DomSanitizer);
  isSidebarCollapsed = signal(false);

  menuItems = [
    { label: 'Bảng điều khiển', link: '/admin', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>') },
    { label: 'Quản lý người dùng', link: '/admin/users', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>') },
    { label: 'Quản lý khóa học', link: '/admin/courses', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>') },
    { label: 'Phân tích', link: '/admin/analytics', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>') },
    { label: 'Cài đặt', link: '/admin/settings', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'), hasSub: true },
    { label: 'Trợ giúp', link: '/admin/help', icon: this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>') },
  ];

  toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  getUserInitials(): string {
    const name = this.supabaseService.currentUser()?.user_metadata?.['full_name'] || 'Admin';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getFirstName(): string {
    const name = this.supabaseService.currentUser()?.user_metadata?.['full_name'] || 'Admin';
    return name.split(' ').pop() || name;
  }
}
