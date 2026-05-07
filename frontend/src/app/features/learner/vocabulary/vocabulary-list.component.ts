import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VocabularyService } from '../../../core/services/vocabulary.service';

@Component({
  selector: 'app-vocabulary-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-10 max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white font-outfit mb-2">Từ vựng của tôi 📖</h1>
          <p class="text-sm md:text-base text-gray-500 dark:text-slate-400">Quản lý và theo dõi quá trình ghi nhớ từ vựng.</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
            <div class="relative flex-grow md:w-64">
              <input type="text" placeholder="Tìm kiếm từ..."
                      (input)="onSearch($event)"
                      class="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button [routerLink]="['/learner/vocabulary/study']"
                    class="px-5 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636 6.364l-.707-.707M12 20v1m-8.364-8.364l.707.707M6.343 6.343l-.707-.707" />
              </svg>
              Ôn tập
            </button>
        </div>
      </header>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div class="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
            <p class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Đã thuộc</p>
            <p class="text-xl md:text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ masteredCount() }}</p>
          </div>
          <div class="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-500/20">
            <p class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Đang học</p>
            <p class="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-300">{{ learningCount() }}</p>
          </div>
          <div class="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-500/20">
            <p class="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Đến hạn ôn</p>
            <p class="text-xl md:text-2xl font-black text-rose-700 dark:text-rose-300">{{ dueCount() }}</p>
          </div>
          <div class="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Mới nạp</p>
            <p class="text-xl md:text-2xl font-black text-indigo-700 dark:text-indigo-300">{{ newCount() }}</p>
          </div>
      </div>

      <!-- Vocabulary Table -->
      <div class="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden overflow-x-auto">
          @if (isLoading()) {
            <div class="p-20 text-center">
              <div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p class="text-gray-400 font-bold">Đang tải danh sách từ vựng...</p>
            </div>
          } @else if (filteredWords().length === 0) {
            <div class="p-20 text-center">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-400 font-bold">Chưa có từ vựng nào trong danh sách.</p>
              <p class="text-sm text-gray-400 mt-2">Hãy học bài và làm Quiz để thêm từ nhé!</p>
            </div>
          } @else {
            <table class="w-full min-w-[600px] text-left border-collapse">
              <thead>
                  <tr class="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Từ vựng</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Nghĩa / Giải thích</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Độ thông thạo</th>
                    <th class="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-white/5">
                  @for (progress of filteredWords(); track progress.id) {
                    <tr class="group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                        <td class="px-8 py-6">
                          <div class="flex flex-col">
                            <span class="text-base md:text-lg font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                              {{ progress.vocabulary.term }}
                            </span>
                            <span class="text-xs text-gray-400 font-mono">{{ progress.vocabulary.ipa }}</span>
                          </div>
                        </td>
                        <td class="px-8 py-6">
                          <p class="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                            {{ progress.vocabulary.translation || progress.vocabulary.definition_vi || progress.vocabulary.definition }}
                          </p>
                        </td>
                        <td class="px-8 py-6">
                          <div class="flex flex-col gap-1.5">
                            <div class="flex gap-1">
                                @for (i of [1,2,3,4,5]; track i) {
                                  <div class="w-4 h-1.5 rounded-full"
                                        [class.bg-emerald-500]="i <= getMasteryLevel(progress)"
                                        [class.bg-gray-100]="i > getMasteryLevel(progress)"
                                        [class.dark:bg-slate-700]="i > getMasteryLevel(progress)"></div>
                                }
                            </div>
                            <span class="text-[10px] font-bold uppercase tracking-tighter"
                                  [class.text-emerald-500]="getMasteryLevel(progress) === 5"
                                  [class.text-gray-400]="getMasteryLevel(progress) < 5">
                              {{ getMasteryLabel(progress) }}
                            </span>
                          </div>
                        </td>
                        <td class="px-8 py-6 text-right">
                          <div class="flex justify-end gap-2">
                            <button (click)="playAudio(progress.vocabulary)" class="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Nghe phát âm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2l5 5V3l-5 5H7a2 2 0 00-2 2z" />
                                </svg>
                            </button>
                            <button (click)="removeProgress(progress.id)" class="p-2 text-gray-400 hover:text-rose-500 transition-colors" title="Xóa khỏi danh sách học">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                          </div>
                        </td>
                    </tr>
                  }
              </tbody>
            </table>
          }
      </div>
    </div>
  `
})
export class VocabularyListComponent implements OnInit {
  vocabService = inject(VocabularyService);
  
  allProgress = signal<any[]>([]);
  filteredWords = signal<any[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');

  // Animated Stats
  masteredCount = signal(0);
  learningCount = signal(0);
  dueCount = signal(0);
  newCount = signal(0);

  ngOnInit() {
    this.loadStats();
    this.loadAllProgress();
  }

  loadStats() {
    this.vocabService.getStats().subscribe(stats => {
      this.animateCount(stats.mastered, this.masteredCount);
      this.animateCount(stats.learning, this.learningCount);
      this.animateCount(stats.due, this.dueCount);
      this.animateCount(stats.newToday, this.newCount);
    });
  }

  loadAllProgress() {
    this.isLoading.set(true);
    this.vocabService.getAllProgress().subscribe({
      next: (progress) => {
        this.allProgress.set(progress);
        this.filteredWords.set(progress);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    this.searchTerm.set(term);
    if (!term) {
      this.filteredWords.set(this.allProgress());
      return;
    }
    const filtered = this.allProgress().filter(p => 
      p.vocabulary.term.toLowerCase().includes(term) || 
      (p.vocabulary.translation && p.vocabulary.translation.toLowerCase().includes(term))
    );
    this.filteredWords.set(filtered);
  }

  getMasteryLevel(progress: any): number {
    if (progress.status === 'mastered') return 5;
    const interval = progress.interval || 0;
    if (interval >= 21) return 5;
    if (interval >= 10) return 4;
    if (interval >= 4) return 3;
    if (interval >= 1) return 2;
    return 1;
  }

  getMasteryLabel(progress: any): string {
    const level = this.getMasteryLevel(progress);
    switch (level) {
      case 5: return 'Đã thuộc lòng';
      case 4: return 'Nhớ khá tốt';
      case 3: return 'Nhớ trung hạn';
      case 2: return 'Bắt đầu nhớ';
      default: return 'Mới nạp / Quên';
    }
  }

  playAudio(vocab: any) {
    if (vocab.audio_url) {
      const audio = new Audio(vocab.audio_url);
      audio.play().catch(err => {
        this.speak(vocab.term);
      });
    } else {
      this.speak(vocab.term);
    }
  }

  private speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  removeProgress(progressId: string) {
    if (confirm('Bạn có chắc muốn xóa từ này khỏi danh sách ôn tập?')) {
      this.vocabService.deleteProgress(progressId).subscribe({
        next: () => {
          this.allProgress.update(all => all.filter(p => p.id !== progressId));
          this.filteredWords.update(all => all.filter(p => p.id !== progressId));
          this.loadStats(); // Refresh stats after removing
        },
        error: (err) => console.error('Lỗi khi xóa từ:', err)
      });
    }
  }

  private animateCount(target: number, signalRef: any) {
    const duration = 1500;
    const startTime = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      signalRef.set(Math.floor(easeValue * target));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}
