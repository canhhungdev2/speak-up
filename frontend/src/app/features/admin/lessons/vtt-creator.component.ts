import {
  Component, ChangeDetectionStrategy, signal, computed,
  ViewChild, ElementRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimedSentence {
  text: string;
  startTime: number;
  endTime: number;
}

@Component({
  selector: 'app-vtt-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-8 max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white font-outfit">VTT Creator 🎬</h1>
        <p class="text-gray-500">Công cụ tạo file VTT thủ công bằng cách đóng dấu thời gian (Stamp Time).</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left: Input & Player -->
        <div class="space-y-6">
          <!-- Card 1: Audio & Stamp -->
          <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <label class="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Step 1: Audio Source</label>
            
            <!-- Modern Drop Zone -->
            @if (!audioSrc()) {
              <div (click)="fileInput.click()" 
                   class="group relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="audio/*" class="hidden">
                <div class="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <p class="font-bold text-gray-900 dark:text-white">Chọn hoặc kéo thả Audio bài học</p>
                <p class="text-xs text-gray-400 mt-1">Hỗ trợ MP3, WAV, AAC...</p>
              </div>
            } @else {
              <!-- Professional Player UI -->
              <div class="space-y-6">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="text-sm font-black text-gray-900 dark:text-white truncate">{{ fileName() }}</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ formatTime(duration()) }}</p>
                    </div>
                    <button (click)="audioSrc.set(null)" class="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-2">
                    <div class="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative cursor-pointer" (click)="seek($event)">
                        <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-100"
                             [style.width.%]="(currentTime() / duration()) * 100"></div>
                    </div>
                    <div class="flex justify-between text-[10px] font-black text-gray-400 tabular-nums">
                        <span>{{ formatTime(currentTime()) }}</span>
                        <span>{{ formatTime(duration()) }}</span>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-2 gap-4">
                        <button (click)="togglePlay()" 
                                class="flex items-center justify-center gap-3 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none">
                            @if (isPlaying()) {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                <span>PAUSE</span>
                            } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span>PLAY</span>
                            }
                        </button>

                        <button (click)="stampTime()" 
                                [disabled]="currentIndex() >= sentences().length"
                                class="group relative flex items-center justify-center gap-3 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>STAMP</span>
                            <span class="absolute -top-2 -right-2 bg-rose-500 text-[10px] px-2 py-0.5 rounded-full border-2 border-white">ENTER</span>
                        </button>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                            <span class="text-sm font-black text-gray-900 dark:text-white">{{ currentIndex() }} / {{ sentences().length }} Sentences</span>
                        </div>
                        <button (click)="reset()" class="px-4 py-2 text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 transition-all uppercase tracking-widest">Reset All</button>
                    </div>
                </div>
              </div>
            }

            <!-- Hidden Audio Element -->
            <audio #audioPlayer 
                   [src]="audioSrc()" 
                   (timeupdate)="onTimeUpdate()"
                   (durationchange)="onDurationChange()"
                   (ended)="isPlaying.set(false)"
                   class="hidden"></audio>
          </div>

          <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">2. Dán nội dung tiếng Anh</label>
            <textarea [(ngModel)]="rawText" 
                      (input)="onTextChange()"
                      class="w-full h-48 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary transition-all text-base font-merriweather"
                      placeholder="Dán các câu tiếng Anh vào đây, mỗi câu một dòng hoặc phân cách bằng dấu chấm..."></textarea>
          </div>
        </div>

        <!-- Right: Result & VTT -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-bold text-gray-400 uppercase tracking-widest">3. Danh sách câu & Time</label>
                <button (click)="copyVtt()" class="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-all">Copy VTT</button>
            </div>

            <div #scrollContainer class="flex-grow overflow-y-auto space-y-2 mb-6 max-h-[400px] scroll-smooth pr-2">
                @for (s of timedSentences(); track $index) {
                    <div [id]="'sentence-' + $index"
                         class="p-3 rounded-xl border transition-all duration-300"
                         [class.bg-primary/5]="currentIndex() === $index"
                         [class.border-primary/40]="currentIndex() === $index"
                         [class.border-gray-100]="currentIndex() !== $index"
                         [class.dark:border-white/5]="currentIndex() !== $index"
                         [class.shadow-lg]="currentIndex() === $index"
                         [class.shadow-primary/5]="currentIndex() === $index">
                        <div class="flex justify-between text-[10px] font-black text-gray-400 mb-1">
                            <span [class.text-primary]="currentIndex() === $index">#{{ $index + 1 }}</span>
                            <span>{{ formatTime(s.startTime) }} --> {{ formatTime(s.endTime) }}</span>
                        </div>
                        <p class="text-sm font-medium transition-colors" 
                           [class.text-primary]="currentIndex() === $index"
                           [class.text-gray-400]="$index < currentIndex()">{{ s.text }}</p>
                    </div>
                }
            </div>

            <div class="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">VTT Output</label>
                <textarea [value]="vttOutput()" readonly
                          class="w-full h-40 p-4 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs outline-none resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .font-outfit { font-family: 'Outfit', sans-serif; }
    .font-merriweather { font-family: 'Merriweather', serif; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `]
})
export class VttCreatorComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  rawText = '';
  audioSrc = signal<string | null>(null);
  fileName = signal<string>('');
  sentences = signal<string[]>([]);
  timedSentences = signal<TimedSentence[]>([]);
  currentIndex = signal(0);
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  onTextChange() {
    if (!this.rawText) {
      this.sentences.set([]);
      return;
    }
    // Split by newlines or dots but keep context
    const lines = this.rawText
      .split(/\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    this.sentences.set(lines);
    
    // Reset timed sentences with the same text
    this.timedSentences.set(lines.map(text => ({ text, startTime: 0, endTime: 0 })));
    this.currentIndex.set(0);
    this.scrollToCurrent();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
      const url = URL.createObjectURL(file);
      this.audioSrc.set(url);
    }
  }

  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if (audio.paused) {
      audio.play();
      this.isPlaying.set(true);
    } else {
      audio.pause();
      this.isPlaying.set(false);
    }
  }

  onTimeUpdate() {
    this.currentTime.set(this.audioPlayer.nativeElement.currentTime);
  }

  onDurationChange() {
    this.duration.set(this.audioPlayer.nativeElement.duration);
  }

  seek(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const time = percentage * this.duration();
    this.audioPlayer.nativeElement.currentTime = time;
  }

  stampTime() {
    const time = this.audioPlayer.nativeElement.currentTime;
    const idx = this.currentIndex();
    const currentSentences = [...this.timedSentences()];

    if (idx < currentSentences.length) {
      // Set end time for current sentence
      currentSentences[idx].endTime = time;
      
      // Move to next
      const nextIdx = idx + 1;
      this.currentIndex.set(nextIdx);
      
      // Set start time for next sentence
      if (nextIdx < currentSentences.length) {
        currentSentences[nextIdx].startTime = time;
      }
      
      this.timedSentences.set(currentSentences);
      this.scrollToCurrent();
    }
  }

  private scrollToCurrent() {
    setTimeout(() => {
      const element = document.getElementById(`sentence-${this.currentIndex()}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }

  reset() {
    this.currentIndex.set(0);
    const resetSentences = this.sentences().map(text => ({ text, startTime: 0, endTime: 0 }));
    this.timedSentences.set(resetSentences);
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.currentTime = 0;
    }
    this.scrollToCurrent();
  }

  vttOutput = computed(() => {
    let output = 'WEBVTT\n\n';
    this.timedSentences().forEach((s, i) => {
      if (s.endTime > 0 || i < this.currentIndex()) {
        output += `${this.formatVttTime(s.startTime)} --> ${this.formatVttTime(s.endTime)}\n`;
        output += `${s.text}\n\n`;
      }
    });
    return output;
  });

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  formatVttTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  copyVtt() {
    navigator.clipboard.writeText(this.vttOutput());
    alert('Đã copy nội dung VTT vào Clipboard!');
  }

  // Keyboard Shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.stampTime();
    } else if (event.key === ' ') {
      // Only toggle play if not typing in textarea
      if (document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        this.togglePlay();
      }
    }
  }
}
