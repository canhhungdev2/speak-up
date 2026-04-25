import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Admin Sidebar -->
      <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col p-6">
        <div class="flex items-center gap-2 mb-10 text-white">
          <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span class="font-bold text-sm">A</span>
          </div>
          <span class="text-xl font-bold">SpeakUp Admin</span>
        </div>
        
        <nav class="flex-grow space-y-1">
          <a href="#" class="flex items-center gap-3 p-3 bg-slate-800 text-white rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </a>
          <a href="#" class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Quản lý khóa học
          </a>
          <a href="#" class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Người dùng
          </a>
        </nav>
      </aside>

      <!-- Admin Main Content -->
      <main class="flex-grow p-10">
        <header class="flex justify-between items-center mb-10">
          <h1 class="text-2xl font-bold text-slate-800">Hệ thống Quản trị</h1>
          <div class="flex items-center gap-4">
             <button class="bg-white p-2 rounded-lg border border-slate-200 shadow-sm relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <div class="w-10 h-10 bg-slate-300 rounded-full"></div>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <p class="text-slate-500 text-sm font-medium mb-1">Tổng người dùng</p>
             <h2 class="text-3xl font-bold text-slate-800">12,482</h2>
             <span class="text-emerald-500 text-xs font-bold">+12% vs tháng trước</span>
           </div>
           <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <p class="text-slate-500 text-sm font-medium mb-1">Doanh thu</p>
             <h2 class="text-3xl font-bold text-slate-800">$4,250</h2>
             <span class="text-emerald-500 text-xs font-bold">+5.4% vs tháng trước</span>
           </div>
           <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <p class="text-slate-500 text-sm font-medium mb-1">Bài học đã học</p>
             <h2 class="text-3xl font-bold text-slate-800">84,120</h2>
           </div>
           <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <p class="text-slate-500 text-sm font-medium mb-1">Tỷ lệ hoàn thành</p>
             <h2 class="text-3xl font-bold text-slate-800">68%</h2>
           </div>
        </div>

        <!-- Recent Activity Table -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div class="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 class="font-bold text-slate-800">Hoạt động gần đây</h3>
             <button class="text-indigo-500 text-sm font-bold hover:underline">Xem tất cả</button>
           </div>
           <table class="w-full text-left border-collapse">
             <thead>
               <tr class="bg-slate-50 text-slate-500 text-sm uppercase">
                 <th class="p-4 font-bold">Người dùng</th>
                 <th class="p-4 font-bold">Hành động</th>
                 <th class="p-4 font-bold">Thời gian</th>
                 <th class="p-4 font-bold">Trạng thái</th>
               </tr>
             </thead>
             <tbody class="text-slate-600">
                <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-medium text-slate-800">Nguyễn Văn A</td>
                  <td class="p-4">Hoàn thành bài học: Day 1</td>
                  <td class="p-4 text-sm">2 phút trước</td>
                  <td class="p-4"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">Thành công</span></td>
                </tr>
                <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td class="p-4 font-medium text-slate-800">Trần Thị B</td>
                  <td class="p-4">Đăng ký khóa học mới</td>
                  <td class="p-4 text-sm">15 phút trước</td>
                  <td class="p-4"><span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">Mới</span></td>
                </tr>
             </tbody>
           </table>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent {}
