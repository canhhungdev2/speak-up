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

      <!-- Right Side: Registration Form -->
      <div class="flex-1 flex flex-col justify-center p-8 md:p-20 bg-white">
        <div class="max-w-md mx-auto w-full space-y-8">
           <div class="text-center md:text-left">
              <h2 class="text-3xl font-black text-gray-900">Tạo tài khoản mới</h2>
              <p class="text-gray-500 mt-2">Hoàn toàn miễn phí, chỉ mất 30 giây.</p>
           </div>

           <!-- Registration Form -->
           <form class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                <input type="text" placeholder="Nhập tên của bạn" 
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="email@example.com" 
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" placeholder="••••••••" 
                       class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
              </div>
              
              <button class="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all transform active:scale-95">
                Đăng ký ngay
              </button>
           </form>

           <div class="relative">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
              <div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-400">Hoặc tiếp tục với</span></div>
           </div>

           <div class="grid grid-cols-2 gap-4">
              <button class="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <img src="https://www.google.com/favicon.ico" class="w-4 h-4" alt="Google">
                Google
              </button>
              <button class="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-gray-700">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
           </div>

           <p class="text-center text-gray-500 text-sm">
              Bạn đã có tài khoản? <a href="#" class="text-primary font-bold hover:underline">Đăng nhập</a>
           </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {}
