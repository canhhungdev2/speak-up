import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <!-- Left Side: Explanation (Desktop) -->
      <div class="hidden md:flex md:w-1/2 bg-primary p-12 text-white flex-col justify-center relative overflow-hidden">
        <div class="relative z-10 space-y-8">
           <div class="flex items-center gap-2 mb-8">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-primary font-bold text-xl">S</span>
            </div>
            <span class="text-2xl font-black tracking-tight">SpeakUp</span>
          </div>

          <h1 class="text-5xl font-black leading-tight">Tại sao bạn nên <br> tham gia cùng chúng tôi?</h1>
          
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-xl">Lưu lại tiến độ học tập</h3>
                <p class="text-white/70">Mọi bài học, từ vựng bạn đã thuộc và chuỗi ngày học (streak) sẽ được lưu lại mãi mãi.</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-xl">Hệ thống ôn tập thông minh (SRS)</h3>
                <p class="text-white/70">Dựa trên thông tin đăng ký, hệ thống sẽ nhắc bạn ôn tập đúng lúc để không bao giờ quên từ vựng.</p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-xl">Tương tác cộng đồng</h3>
                <p class="text-white/70">Để thảo luận và hỏi đáp cùng hàng ngàn người học khác, bạn cần một định danh duy nhất.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative Circles -->
        <div class="absolute top-[-100px] left-[-100px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
      </div>

      <!-- Right Side: Social Login Only -->
      <div class="flex-1 flex flex-col justify-center p-8 md:p-20 bg-white relative">
        <div class="max-w-md mx-auto w-full space-y-10 relative z-10">
           <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 class="text-4xl font-black text-gray-900 tracking-tight">Bắt đầu học ngay</h2>
              <p class="text-gray-500 mt-3 text-lg">Tham gia cùng +10,000 học viên khác chỉ với một cú nhấp chuột.</p>
           </div>

           <div class="space-y-4">
              <!-- Google Login Button (Primary) -->
              <button type="button" class="group relative w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary/30 hover:bg-gray-50 transition-all duration-300 transform active:scale-[0.98] shadow-sm">
                <img src="https://www.google.com/favicon.ico" class="w-5 h-5" alt="Google">
                <span class="text-gray-700 font-bold text-lg">Tiếp tục với Google</span>
                <div class="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <!-- Facebook Login Button -->
              <button type="button" class="group relative w-full flex items-center justify-center gap-3 py-4 bg-[#1877F2] text-white rounded-2xl hover:bg-[#166fe5] transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-blue-500/20">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span class="font-bold text-lg">Tiếp tục với Facebook</span>
              </button>
           </div>

           <div class="pt-8 border-t border-gray-50">
             <p class="text-center text-gray-400 text-sm leading-relaxed">
                Bằng cách tiếp tục, bạn đồng ý với <a href="#" class="text-gray-600 font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" class="text-gray-600 font-semibold hover:underline">Chính sách bảo mật</a> của SpeakUp.
             </p>
           </div>

           <p class="text-center text-gray-500">
              Bạn gặp khó khăn? <a href="#" class="text-primary font-bold hover:underline">Hỗ trợ ngay</a>
           </p>
        </div>

        <!-- Background Decorative Elements -->
        <div class="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
           <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="2" stroke-dasharray="8 8" class="text-gray-200" />
           </svg>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent { }
