import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-white flex flex-col">
      <!-- Navigation -->
      <nav class="border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">SpeakUp</span>
        </div>
        <div class="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <a href="#" class="hover:text-primary transition-colors">Về dự án</a>
          <a href="#" class="hover:text-primary transition-colors">Phương pháp</a>
          <a href="#" class="hover:text-primary transition-colors">Đóng góp</a>
        </div>
        <div class="flex items-center gap-4">
          <button routerLink="/register" class="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">Tham gia ngay</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <main class="flex-grow">
        <section class="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 space-y-8">
            <div class="inline-block px-4 py-1.5 bg-primary-light text-primary font-bold rounded-full text-sm">
              ❤️ Dự án phi lợi nhuận vì cộng đồng
            </div>
            <h1 class="text-6xl md:text-7xl font-extrabold leading-tight text-gray-900">
              Học tiếng Anh <br> 
              <span class="text-primary">Cùng nhau, Miễn phí</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-xl leading-relaxed">
              SpeakUp là nền tảng học tiếng Anh mở, nơi mọi người cùng nhau chia sẻ, học tập và tiến bộ. Hoàn toàn miễn phí, mãi mãi dành cho cộng đồng Việt.
            </p>
            <div class="flex items-center gap-6">
              <button routerLink="/register" class="px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-hover shadow-xl shadow-primary/30 transition-all hover:-translate-y-1">
                Bắt đầu học ngay
              </button>
              <button class="flex items-center gap-2 font-bold text-gray-700 hover:text-primary group">
                <span class="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-full group-hover:border-primary group-hover:bg-primary-light transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                Gặp gỡ cộng đồng
              </button>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="w-full h-[500px] bg-gradient-to-br from-primary-light to-secondary-light rounded-[3rem] overflow-hidden shadow-2xl relative">
              <!-- Glassmorphism Card Overlay -->
              <div class="absolute top-10 right-[-20px] bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/50 animate-bounce-slow">
                 <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                   </div>
                   <div>
                     <p class="text-sm font-bold text-gray-500">Tiến độ hôm nay</p>
                     <p class="text-xl font-black text-gray-900">Hoàn thành 85%</p>
                   </div>
                 </div>
              </div>

              <!-- Content Placeholder -->
              <div class="absolute inset-0 flex items-center justify-center">
                 <div class="text-primary opacity-20 transform -rotate-12 scale-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                    </svg>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-50 border-t border-gray-100 py-12">
        <div class="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© 2026 SpeakUp. Toàn bộ bản quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 4s ease-in-out infinite;
    }
  `]
})
export class LandingComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  title = signal('SpeakUp');

  constructor() {
    effect(() => {
      if (this.supabaseService.isLoggedIn()) {
        this.router.navigate(['/learner/courses']);
      }
    });
  }
}
