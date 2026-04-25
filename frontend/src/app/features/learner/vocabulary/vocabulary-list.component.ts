import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearnerLayoutComponent } from '../layout/learner-layout.component';

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LearnerLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-learner-layout>
      <div class="p-4 md:p-10 max-w-6xl mx-auto">
        <!-- Header -->
        <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 class="text-3xl font-black text-gray-900 dark:text-white font-outfit mb-2">Từ vựng của tôi 📖</h1>
            <p class="text-gray-500 dark:text-slate-400">Quản lý và theo dõi quá trình ghi nhớ từ vựng.</p>
          </div>
          <div class="flex gap-4 w-full md:w-auto">
             <div class="relative flex-grow md:w-72">
                <input type="text" placeholder="Tìm kiếm từ..." 
                       class="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <button class="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                + Thêm từ
             </button>
          </div>
        </header>

        <!-- Stats Bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           <div class="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
              <p class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Đã thuộc</p>
              <p class="text-2xl font-black text-emerald-700 dark:text-emerald-300">850</p>
           </div>
           <div class="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-500/20">
              <p class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Đang học</p>
              <p class="text-2xl font-black text-amber-700 dark:text-amber-300">320</p>
           </div>
           <div class="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-500/20">
              <p class="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Đến hạn ôn</p>
              <p class="text-2xl font-black text-rose-700 dark:text-rose-300">45</p>
           </div>
           <div class="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
              <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Mới nạp</p>
              <p class="text-2xl font-black text-indigo-700 dark:text-indigo-300">12</p>
           </div>
        </div>

        <!-- Vocabulary Table -->
        <div class="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
           <table class="w-full text-left border-collapse">
              <thead>
                 <tr class="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Từ vựng</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Nghĩa / Giải thích</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Độ thông thạo</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                 @for (word of words(); track word.term) {
                    <tr class="group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                       <td class="px-8 py-6">
                          <span class="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{{ word.term }}</span>
                       </td>
                       <td class="px-8 py-6">
                          <p class="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">{{ word.definition }}</p>
                       </td>
                       <td class="px-8 py-6">
                          <div class="flex gap-1">
                             @for (i of [1,2,3,4,5]; track i) {
                                <div class="w-4 h-1.5 rounded-full" [class.bg-primary]="i <= word.level" [class.bg-gray-100]="i > word.level" [class.dark:bg-slate-700]="i > word.level"></div>
                             }
                          </div>
                       </td>
                       <td class="px-8 py-6 text-right">
                          <button class="p-2 text-gray-400 hover:text-primary transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                          </button>
                       </td>
                    </tr>
                 }
              </tbody>
           </table>
        </div>
      </div>
    </app-learner-layout>
  `
})
export class VocabularyListComponent {
  words = signal([
    { term: 'Persistent', definition: 'Kiên trì, bền bỉ', level: 4 },
    { term: 'Vocabulary', definition: 'Từ vựng', level: 5 },
    { term: 'Effortless', definition: 'Không tốn sức, tự nhiên', level: 3 },
    { term: 'Interactive', definition: 'Có tính tương tác', level: 2 },
    { term: 'Community', definition: 'Cộng đồng', level: 5 },
  ]);
}
