import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject, HostListener, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VocabularyService, UserVocabularyProgress } from '../../../core/services/vocabulary.service';
import { finalize } from 'rxjs';

interface StudyCard {
  id: string;
  term: string;
  ipa: string;
  definition: string;
  example: string;
  wordType: string;
  vocabId: string;
}

type StudyPhase = 'front' | 'back' | 'done';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden font-sans"
         [class.shake]="shaking()">
      <!-- Background glows -->
      <div class="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      @if (phase() === 'loading') {
        <div class="flex-grow flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p class="mt-4 text-white/50 font-bold">Đang tải từ vựng...</p>
        </div>
      } @else if (phase() === 'empty') {
        <div class="flex-grow flex flex-col items-center justify-center text-center px-6">
          <div class="text-6xl mb-6">🎯</div>
          <h2 class="text-3xl font-black text-white mb-2">Bạn đã hoàn thành hết!</h2>
          <p class="text-white/40 mb-8 max-w-sm">Không còn từ vựng nào cần ôn tập hôm nay. Hãy quay lại sau hoặc học bài mới nhé.</p>
          <button (click)="exitStudy()" class="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
            Quay về trang chủ
          </button>
        </div>
      } @else if (phase() !== 'done') {
        <!-- Top Bar -->
        <header class="relative z-10 flex items-center gap-4 px-6 py-4">
          <button (click)="exitStudy()" class="p-2 text-white/40 hover:text-white/80 transition-colors rounded-xl hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Progress Bar -->
          <div class="flex-grow h-3 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                 [style.width.%]="progressPercent()"></div>
          </div>

          <span class="text-white/50 text-sm font-bold tabular-nums">
            Còn lại: {{ remainingCount() }}
          </span>
        </header>

        <!-- Card Area -->
        <main class="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-8">
          <div class="w-full max-w-xl">
            <!-- Card -->
            <div class="card-container mb-10" [class.flipped]="phase() === 'back'">
              <!-- Front -->
              <div class="card-face card-front">
                <div class="flex flex-col items-center justify-center h-full p-10 text-center gap-6">
                  <span class="px-4 py-1.5 bg-white/10 rounded-full text-xs font-black text-white/50 uppercase tracking-widest">
                    {{ currentCard().wordType }}
                  </span>
                  <h1 class="text-6xl font-black text-white tracking-tight font-outfit">
                    {{ currentCard().term }}
                  </h1>
                  <p class="text-xl text-white/40 font-mono">{{ currentCard().ipa }}</p>
                  <button (click)="playAudio()" class="mt-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/50 hover:text-white/80 transition-all border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m0 0v.001M12 6v.001m0-.001v-.001M12 18v.001" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Back -->
              <div class="card-face card-back">
                <div class="flex flex-col items-center justify-center h-full p-10 text-center gap-4">
                  <span class="px-4 py-1.5 bg-white/10 rounded-full text-xs font-black text-white/50 uppercase tracking-widest">
                    {{ currentCard().wordType }}
                  </span>
                  <h2 class="text-4xl font-black text-white font-outfit">{{ currentCard().term }}</h2>
                  <div class="w-16 h-0.5 bg-white/10 rounded-full"></div>
                  <p class="text-2xl font-bold text-white/90">{{ currentCard().definition }}</p>
                  <p class="text-base text-white/40 italic leading-relaxed">"{{ currentCard().example }}"</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            @if (phase() === 'front') {
              <button (click)="reveal()" 
                      class="w-full py-4 bg-gradient-to-r from-primary to-rose-500 text-white font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30">
                Hiện đáp án
                <span class="ml-2 text-white/60 text-sm font-normal">[Space]</span>
              </button>
            }

            @if (phase() === 'back') {
              <div class="grid grid-cols-4 gap-3">
                <!-- Again -->
                <button (click)="rate('again')" class="rating-btn again">
                  <span class="text-2xl">😵</span>
                  <span class="font-black text-sm">Quên</span>
                  <span class="text-[10px] opacity-60">1 phút</span>
                  <span class="rating-key">1</span>
                </button>
                <!-- Hard -->
                <button (click)="rate('hard')" class="rating-btn hard">
                  <span class="text-2xl">😓</span>
                  <span class="font-black text-sm">Khó</span>
                  <span class="text-[10px] opacity-60">10 phút</span>
                  <span class="rating-key">2</span>
                </button>
                <!-- Good -->
                <button (click)="rate('good')" class="rating-btn good">
                  <span class="text-2xl">😊</span>
                  <span class="font-black text-sm">Tốt</span>
                  <span class="text-[10px] opacity-60">1 ngày</span>
                  <span class="rating-key">3</span>
                </button>
                <!-- Easy -->
                <button (click)="rate('easy')" class="rating-btn easy">
                  <span class="text-2xl">😎</span>
                  <span class="font-black text-sm">Dễ</span>
                  <span class="text-[10px] opacity-60">4 ngày</span>
                  <span class="rating-key">4</span>
                </button>
              </div>
            }
          </div>
        </main>
      }

      <!-- PHASE: DONE -->
      @if (phase() === 'done') {
        <div class="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-8 text-center">
          <!-- Confetti particles -->
          @for (p of particles; track p.id) {
            <div class="particle" [style.left.%]="p.x" [style.top.%]="p.y"
                 [style.background]="p.color" [style.animation-delay.ms]="p.delay"></div>
          }

          <div class="text-7xl mb-6 animate-bounce">🎉</div>
          <h1 class="text-4xl font-black text-white font-outfit mb-2">Hoàn thành phiên ôn tập!</h1>
          <p class="text-white/40 mb-12">Tuyệt vời! Bạn đã hoàn thành {{ results().total }} từ hôm nay.</p>

          <!-- Stats Card -->
          <div class="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl">
            <div class="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p class="text-3xl font-black text-white">{{ results().total }}</p>
                <p class="text-xs text-white/40 uppercase tracking-widest mt-1">Từ ôn tập</p>
              </div>
              <div>
                <p class="text-3xl font-black text-emerald-400">{{ results().accuracy }}%</p>
                <p class="text-xs text-white/40 uppercase tracking-widest mt-1">Chính xác</p>
              </div>
              <div>
                <p class="text-3xl font-black text-yellow-400">+{{ results().xp }}</p>
                <p class="text-xs text-white/40 uppercase tracking-widest mt-1">XP nhận</p>
              </div>
            </div>

            <!-- SRS Breakdown Bar -->
            <div class="space-y-2">
              <p class="text-xs font-black text-white/40 uppercase tracking-widest text-left">Kết quả phân loại</p>
              <div class="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div class="bg-rose-500 transition-all" [style.flex]="results().again"></div>
                <div class="bg-amber-500 transition-all" [style.flex]="results().hard"></div>
                <div class="bg-emerald-500 transition-all" [style.flex]="results().good"></div>
                <div class="bg-blue-500 transition-all" [style.flex]="results().easy"></div>
              </div>
              <div class="flex justify-between text-[10px] font-bold text-white/40">
                <span>😵 {{ results().again }}</span>
                <span>😓 {{ results().hard }}</span>
                <span>😊 {{ results().good }}</span>
                <span>😎 {{ results().easy }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 w-full max-w-md">
            <button (click)="exitStudy()"
                    class="flex-1 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
              Về trang chủ
            </button>
            <button (click)="restart()"
                    class="flex-1 py-4 bg-gradient-to-r from-primary to-rose-500 text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/30">
              Ôn tập tiếp
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .card-container {
      perspective: 1200px;
      height: 320px;
    }
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 2rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-front { transform: rotateY(0deg); }
    .card-back  { transform: rotateY(180deg); }
    .card-container.flipped .card-front { transform: rotateY(-180deg); }
    .card-container.flipped .card-back  { transform: rotateY(0deg); }

    .rating-btn {
      @apply flex flex-col items-center gap-1.5 py-5 px-2 rounded-2xl border transition-all hover:scale-105 active:scale-95 relative cursor-pointer;
    }
    .again { @apply bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20; }
    .hard  { @apply bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20; }
    .good  { @apply bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20; }
    .easy  { @apply bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20; }

    .rating-key {
      @apply absolute top-2 right-2 w-4 h-4 text-[9px] font-black bg-white/10 rounded-md flex items-center justify-center;
    }

    .particle {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: confetti 2s ease-in forwards;
      opacity: 0;
    }
    @keyframes confetti {
      0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }

    @keyframes shake-anim {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    .shake { animation: shake-anim 0.4s ease; }
  `]
})
export class StudyComponent implements OnInit {
  vocabService = inject(VocabularyService);
  router = inject(Router);

  phase = signal<StudyPhase | 'loading' | 'empty'>('loading');
  currentIndex = signal(0);
  shaking = signal(false);
  isLoading = signal(false);
  initialTotal = signal(0);
  results = signal({ total: 0, accuracy: 0, xp: 0, again: 0, hard: 0, good: 0, easy: 0 });

  private ratingCounts = { again: 0, hard: 0, good: 0, easy: 0 };

  queue = signal<StudyCard[]>([]);
  
  currentCard = computed(() => this.queue()[this.currentIndex()]);
  remainingCount = computed(() => {
    const total = this.queue().length;
    return total - this.currentIndex();
  });
  progressPercent = computed(() => {
    const total = this.initialTotal() || 1;
    const finished = total - this.remainingCount();
    return Math.min((finished / total) * 100, 100);
  });

  particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 40,
    color: ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 1000
  }));

  ngOnInit() {
    this.loadDueWords();
  }

  loadDueWords() {
    this.phase.set('loading');
    this.vocabService.getDueWords().subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.phase.set('empty');
          return;
        }
        
        const mapped = data.map(item => ({
          id: item.id,
          vocabId: item.vocabulary_id,
          term: item.vocabulary.term,
          ipa: item.vocabulary.ipa || '',
          definition: item.vocabulary.translation || item.vocabulary.definition_vi || item.vocabulary.definition,
          example: item.vocabulary.example || '',
          wordType: item.vocabulary.word_type || ''
        }));
        
        this.queue.set(mapped);
        this.initialTotal.set(mapped.length);
        this.phase.set('front');
      },
      error: (err) => {
        console.error('Lỗi tải từ vựng:', err);
        this.phase.set('empty');
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (e.key === ' ' && this.phase() === 'front') {
      e.preventDefault();
      this.reveal();
    }
    if (this.phase() === 'back') {
      if (e.key === '1') this.rate('again');
      if (e.key === '2') this.rate('hard');
      if (e.key === '3') this.rate('good');
      if (e.key === '4') this.rate('easy');
    }
  }

  reveal() {
    this.phase.set('back');
  }

  rate(rating: 'again' | 'hard' | 'good' | 'easy') {
    if (this.isLoading()) return;

    this.ratingCounts[rating]++;
    const card = this.currentCard();
    
    this.isLoading.set(true);
    this.vocabService.updateSRSProgress(card.vocabId, rating)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          // "Again" = requeue card at end in the local view
          if (rating === 'again') {
            this.queue.update(q => [...q, card]);
          }

          const next = this.currentIndex() + 1;
          if (next >= this.queue().length) {
            this.finishSession();
          } else {
            // Reset phase to front first
            this.phase.set('front');
            
            // Wait a tiny bit for the animation to start before swapping content
            setTimeout(() => {
              this.currentIndex.set(next);
            }, 150);
          }
        },
        error: (err) => {
          console.error('Lỗi cập nhật tiến độ:', err);
          this.shaking.set(true);
          setTimeout(() => this.shaking.set(false), 400);
        }
      });
  }

  private finishSession() {
    const total = this.initialTotal();
    const good = this.ratingCounts.good + this.ratingCounts.easy;
    const accuracy = Math.round((good / total) * 100);
    const xp = good * 10 + this.ratingCounts.hard * 5;

    this.results.set({
      total,
      accuracy,
      xp,
      again: this.ratingCounts.again,
      hard: this.ratingCounts.hard,
      good: this.ratingCounts.good,
      easy: this.ratingCounts.easy
    });
    this.phase.set('done');
  }

  restart() {
    this.currentIndex.set(0);
    this.phase.set('front');
    this.ratingCounts = { again: 0, hard: 0, good: 0, easy: 0 };
  }

  exitStudy() {
    this.router.navigate(['/learner']);
  }

  playAudio() {
    const utterance = new SpeechSynthesisUtterance(this.currentCard().term);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}
