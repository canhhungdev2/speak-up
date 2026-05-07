import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject, input, output, OnInit, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularyService, Vocabulary } from '../../../core/services/vocabulary.service';
import { finalize } from 'rxjs';

interface QuizQuestion {
  vocab: Vocabulary;
  options: string[];
  correctIndex: number;
}

type QuizPhase = 'playing' | 'answered' | 'result';

@Component({
  selector: 'app-vocab-quiz',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Overlay -->
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="onClose()"></div>

      <!-- Quiz Card -->
      <div class="relative z-10 w-full max-w-2xl bg-[#0f172a] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden">

        <!-- PHASE: PLAYING / ANSWERED -->
        @if (phase() !== 'result') {
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div class="flex items-center gap-3">
              <span class="text-lg">🧠</span>
              <span class="text-white/50 text-sm font-bold">Kiểm tra từ vựng</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-grow h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                     [style.width.%]="progressPercent()"></div>
              </div>
              <span class="text-white/40 text-xs font-bold tabular-nums">
                {{ currentIndex() + 1 }}/{{ questions().length }}
              </span>
              <button (click)="onClose()" class="p-1.5 text-white/30 hover:text-white/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Question -->
          <div class="p-8 md:p-10">
            <!-- English term prompt -->
            <div class="mb-8 text-center">
              <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Chọn nghĩa đúng của từ</p>
              <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight font-outfit mb-2">
                {{ currentQuestion().vocab.term }}
              </h2>
              @if (currentQuestion().vocab.ipa) {
                <p class="text-base text-white/40 font-mono">{{ currentQuestion().vocab.ipa }}</p>
              }
              @if (currentQuestion().vocab.example) {
                <p class="mt-3 text-sm text-white/30 italic">"{{ currentQuestion().vocab.example }}"</p>
              }
            </div>

            <!-- Options Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (option of currentQuestion().options; track $index) {
                <button (click)="selectAnswer($index)"
                        [disabled]="phase() === 'answered'"
                        class="quiz-option relative px-6 py-4 rounded-2xl border-2 text-left font-bold text-base transition-all"
                        [class.border-white/10]="phase() === 'playing'"
                        [class.bg-white/5]="phase() === 'playing'"
                        [class.text-white]="phase() === 'playing'"
                        [class.hover:border-primary/50]="phase() === 'playing'"
                        [class.hover:bg-primary/10]="phase() === 'playing'"
                        [class.border-emerald-500]="phase() === 'answered' && $index === currentQuestion().correctIndex"
                        [class.bg-emerald-500/20]="phase() === 'answered' && $index === currentQuestion().correctIndex"
                        [class.text-emerald-300]="phase() === 'answered' && $index === currentQuestion().correctIndex"
                        [class.border-rose-500]="phase() === 'answered' && $index === selectedIndex() && $index !== currentQuestion().correctIndex"
                        [class.bg-rose-500/20]="phase() === 'answered' && $index === selectedIndex() && $index !== currentQuestion().correctIndex"
                        [class.text-rose-300]="phase() === 'answered' && $index === selectedIndex() && $index !== currentQuestion().correctIndex"
                        [class.border-white/5]="phase() === 'answered' && $index !== currentQuestion().correctIndex && $index !== selectedIndex()"
                        [class.text-white/20]="phase() === 'answered' && $index !== currentQuestion().correctIndex && $index !== selectedIndex()"
                        >
                  <span class="absolute top-3 right-3 w-5 h-5 text-[10px] font-black bg-white/10 rounded-md flex items-center justify-center text-white/30">
                    {{ $index + 1 }}
                  </span>
                  {{ option }}
                </button>
              }
            </div>

            <!-- Next Button (shown after answer) -->
            @if (phase() === 'answered') {
              <div class="mt-6 text-center">
                <button (click)="nextQuestion()"
                        class="px-8 py-3 bg-gradient-to-r from-primary to-rose-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  {{ isLastQuestion() ? 'Xem kết quả' : 'Câu tiếp theo' }}
                  <span class="ml-2 text-white/60 text-sm">[Space]</span>
                </button>
              </div>
            }
          </div>
        }

        <!-- PHASE: RESULT -->
        @if (phase() === 'result') {
          <div class="p-8 md:p-12 text-center">
            <!-- Confetti -->
            @for (p of particles; track p.id) {
              <div class="particle" [style.left.%]="p.x" [style.top.%]="p.y"
                   [style.background]="p.color" [style.animation-delay.ms]="p.delay"></div>
            }

            <div class="text-6xl mb-4">{{ resultEmoji() }}</div>
            <h2 class="text-3xl font-black text-white mb-2 font-outfit">{{ resultTitle() }}</h2>
            <p class="text-white/40 mb-8">Bạn đã trả lời đúng {{ correctCount() }}/{{ questions().length }} câu</p>

            <!-- Score Bar -->
            <div class="w-full max-w-sm mx-auto mb-8">
              <div class="flex h-4 rounded-full overflow-hidden gap-0.5">
                <div class="bg-emerald-500 transition-all" [style.flex]="correctCount()"></div>
                <div class="bg-rose-500 transition-all" [style.flex]="questions().length - correctCount()"></div>
              </div>
              <div class="flex justify-between mt-2 text-xs font-bold text-white/40">
                <span>✅ {{ correctCount() }} đúng</span>
                <span>❌ {{ questions().length - correctCount() }} sai</span>
              </div>
            </div>

            <!-- Info -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 max-w-sm mx-auto">
              <p class="text-sm text-white/50">
                @if (isSubmitting()) {
                  <span class="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2 align-middle"></span>
                  Đang lưu vào danh sách ôn tập...
                } @else if (submitted()) {
                  ✅ Đã thêm {{ questions().length }} từ vào danh sách ôn tập hằng ngày!
                } @else {
                  📝 Bấm nút bên dưới để lưu kết quả
                }
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-center">
              @if (!submitted()) {
                <button (click)="submitResults()" [disabled]="isSubmitting()"
                        class="px-8 py-3 bg-gradient-to-r from-primary to-rose-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                  Thêm vào danh sách ôn tập
                </button>
              } @else {
                <button (click)="onClose()"
                        class="px-8 py-3 bg-gradient-to-r from-primary to-rose-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  Hoàn tất 🎉
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .quiz-option:not(:disabled):hover { transform: translateY(-2px); }
    .quiz-option:disabled { cursor: default; }

    .particle {
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      animation: confetti 2s ease-in forwards;
      opacity: 0;
    }
    @keyframes confetti {
      0% { transform: translateY(-80px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(60vh) rotate(720deg); opacity: 0; }
    }
  `]
})
export class VocabQuizComponent implements OnInit {
  vocabularies = input.required<Vocabulary[]>();
  closed = output<void>();

  private vocabService = inject(VocabularyService);

  phase = signal<QuizPhase>('playing');
  currentIndex = signal(0);
  selectedIndex = signal(-1);
  questions = signal<QuizQuestion[]>([]);
  answers = signal<boolean[]>([]);
  isSubmitting = signal(false);
  submitted = signal(false);

  currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  progressPercent = computed(() => ((this.currentIndex()) / this.questions().length) * 100);
  isLastQuestion = computed(() => this.currentIndex() === this.questions().length - 1);
  correctCount = computed(() => this.answers().filter(a => a).length);

  resultEmoji = computed(() => {
    const pct = this.correctCount() / this.questions().length;
    if (pct >= 0.8) return '🏆';
    if (pct >= 0.5) return '👍';
    return '💪';
  });

  resultTitle = computed(() => {
    const pct = this.correctCount() / this.questions().length;
    if (pct >= 0.8) return 'Xuất sắc!';
    if (pct >= 0.5) return 'Khá tốt!';
    return 'Cần luyện thêm!';
  });

  particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 30,
    color: ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 800
  }));

  ngOnInit() {
    this.generateQuestions();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (this.phase() === 'playing') {
      if (e.key >= '1' && e.key <= '4') {
        this.selectAnswer(parseInt(e.key) - 1);
      }
    }
    if (this.phase() === 'answered' && e.key === ' ') {
      e.preventDefault();
      this.nextQuestion();
    }
  }

  private generateQuestions() {
    const vocabs = this.vocabularies();
    if (vocabs.length < 2) return;

    const getDisplayMeaning = (v: Vocabulary) => v.translation || v.definition;

    const shuffled = [...vocabs].sort(() => Math.random() - 0.5);
    const questions: QuizQuestion[] = shuffled.map(vocab => {
      // Get 3 wrong options (Vietnamese meanings) from other vocabs
      const otherMeanings = vocabs
        .filter(v => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => getDisplayMeaning(v));

      const correctMeaning = getDisplayMeaning(vocab);
      const options = [...otherMeanings, correctMeaning].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctMeaning);

      return { vocab, options, correctIndex };
    });

    this.questions.set(questions);
  }

  selectAnswer(index: number) {
    if (this.phase() !== 'playing') return;
    this.selectedIndex.set(index);
    const isCorrect = index === this.currentQuestion().correctIndex;
    this.answers.update(a => [...a, isCorrect]);
    this.phase.set('answered');
  }

  nextQuestion() {
    if (this.isLastQuestion()) {
      this.phase.set('result');
      return;
    }
    this.currentIndex.update(i => i + 1);
    this.selectedIndex.set(-1);
    this.phase.set('playing');
  }

  submitResults() {
    this.isSubmitting.set(true);

    const items = this.questions().map((q, i) => ({
      vocabId: q.vocab.id,
      rating: this.answers()[i] ? 'good' as const : 'again' as const
    }));

    this.vocabService.learnBatch(items)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.submitted.set(true),
        error: (err) => console.error('Lỗi lưu kết quả quiz:', err)
      });
  }

  onClose() {
    this.closed.emit();
  }
}
