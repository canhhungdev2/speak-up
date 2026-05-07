import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject, effect, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../../../core/services/media.service';
import { LessonService } from '../../../core/services/lesson.service';
import { VocabularyService } from '../../../core/services/vocabulary.service';
import { VocabQuizComponent } from './vocab-quiz.component';
import { environment } from '../../../../environments/environment';

interface StorySentence {
  text: string;
  startTime: number;
  endTime: number;
}

interface MiniStory {
  id: string;
  title: string;
  audioUrl: string;
  vttUrl?: string;
  sentences: StorySentence[];
}

interface LessonSection {
  id: string;
  title: string;
  icon: string;
  type: 'article' | 'vocab' | 'story' | 'pov' | 'commentary';
  audioUrl: string;
  vttUrl?: string;
  sentences?: StorySentence[];
  content?: string;
  paragraphs?: { en: string; vi: string; }[];
  vocabList?: { term: string; definition: string; }[];
  stories?: MiniStory[];
}

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, RouterModule, VocabQuizComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-[calc(100vh-6rem)] overflow-hidden relative" *ngIf="lessonData() as lesson">
      
      <!-- Lesson Sections Sidebar (Desktop) -->
      <aside class="w-80 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e293b]/30 overflow-y-auto hidden lg:block scrollbar-hide shrink-0">
        <div class="p-6">
            <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Nội dung bài học</p>
            <nav class="space-y-2">
              @for (section of sections(); track section.id) {
                  <button (click)="setActiveSection(section)"
                          [class.bg-primary/10]="activeSection().id === section.id"
                          [class.text-primary]="activeSection().id === section.id"
                          class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                          [class.bg-primary/20]="activeSection().id === section.id">
                        <span class="text-xl">{{ section.icon }}</span>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="font-bold text-sm truncate" [class.text-gray-900]="activeSection().id !== section.id" [class.dark:text-white]="activeSection().id !== section.id">
                          {{ section.title }}
                        </p>
                        <p class="text-[10px] text-gray-400 uppercase font-black tracking-wider mt-0.5">
                          {{ section.type }}
                        </p>
                    </div>
                  </button>
              }
            </nav>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-grow overflow-y-auto p-4 md:p-12 bg-gray-50 dark:bg-transparent relative scrollbar-hide">
          <div class="max-w-6xl mx-auto pb-40 md:pb-32">
            
            <!-- Mobile Section Selector Toggle -->
            <div class="lg:hidden sticky top-0 z-[45] pt-4 -mt-4 mb-4 pb-2 pointer-events-none">
                <button (click)="isMobileSidebarOpen.set(true)" 
                        class="flex items-center gap-3 px-5 py-3 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg hover:border-primary/30 transition-all w-fit pointer-events-auto">
                    <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span class="text-sm font-bold text-gray-700 dark:text-slate-300">Nội dung bài học</span>
                </button>
            </div>
            
            <div class="mb-8 md:mb-12">
                <span class="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                  {{ activeSection().type }}
                </span>
                <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-outfit tracking-tight leading-tight">
                  {{ activeSection().title }}
                </h1>
            </div>

            @switch (activeSection().type) {
                @case ('article') {
                  <div class="space-y-6">
                      @for (p of activeSection().paragraphs; track $index) {
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 group border-b border-gray-100/50 dark:border-white/5 pb-6 last:border-0">
                            <div class="prose prose-lg md:prose-xl dark:prose-invert prose-p:m-0 max-w-none font-merriweather text-gray-800 dark:text-slate-200 leading-relaxed tracking-tight" [innerHTML]="p.en"></div>
                            <div class="prose prose-lg md:prose-xl dark:prose-invert prose-p:m-0 max-w-none font-merriweather text-gray-500/80 dark:text-slate-400/80 italic border-l-2 border-gray-100 pl-8" [innerHTML]="p.vi"></div>
                        </div>
                      }
                  </div>
                }
                @case ('vocab') {
                  <div class="space-y-6">
                      <!-- Quiz Button -->
                      @if (lesson.vocabularies?.length >= 4) {
                        <button (click)="isQuizOpen.set(true)"
                                class="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-base rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3">
                          <span class="text-xl">🧠</span>
                          Kiểm tra từ vựng bài này
                          <span class="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs">{{ lesson.vocabularies.length }} từ</span>
                        </button>
                      }
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        @for (vocab of lesson.vocabularies; track vocab.id) {
                            <div class="p-5 md:p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl md:rounded-[1.5rem] hover:border-primary/30 hover:shadow-sm transition-all group">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-baseline gap-2 flex-wrap">
                                        <h3 class="text-xl md:text-2xl font-black text-primary">{{ vocab.term }}</h3>
                                        <span class="text-sm md:text-base text-gray-400 dark:text-slate-500 font-medium">{{ vocab.ipa }}</span>
                                    </div>
                                    <div class="flex items-center gap-3 shrink-0 text-gray-400 dark:text-slate-500">
                                        <button (click)="addToStudy(vocab.id)" class="hover:text-emerald-500 transition-colors" title="Thêm vào danh sách ôn tập">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                        <button (click)="playVocabAudio(vocab)" class="hover:text-blue-500 transition-colors" title="Nghe phát âm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2l5 5V3l-5 5H7a2 2 0 00-2 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p class="text-lg md:text-xl font-bold text-gray-800 dark:text-slate-200 mb-4">{{ vocab.translation || vocab.definition }}</p>
                                <div class="border-l-[3px] border-gray-200 dark:border-white/10 pl-3 md:pl-4">
                                    <p class="text-sm md:text-base text-gray-600 dark:text-slate-400">
                                        <span class="font-bold text-gray-700 dark:text-slate-300 mr-1">Example:</span> 
                                        {{ vocab.example }}
                                    </p>
                                </div>
                            </div>
                        }
                      </div>
                  </div>

                  <!-- Quiz Overlay -->
                  @if (isQuizOpen()) {
                    <app-vocab-quiz [vocabularies]="lesson.vocabularies" (closed)="isQuizOpen.set(false)" />
                  }
                }
                @case ('story') {
                  <div class="space-y-8">
                      <div class="flex gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit overflow-x-auto">
                        @for (story of activeSection().stories; track story.id; let i = $index) {
                            <button (click)="setActiveStory(i)"
                                    [class.bg-white]="activeStoryIndex() === i"
                                    class="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                                    [class.text-primary]="activeStoryIndex() === i">
                                Story {{ i + 1 }}
                            </button>
                        }
                      </div>

                      <div class="bg-white dark:bg-white/5 p-8 md:p-14 rounded-[2.5rem] border border-gray-100 dark:border-white/10 relative overflow-hidden shadow-sm">
                        <div class="flex flex-wrap gap-x-2 gap-y-3">
                          @for (s of currentStory()?.sentences; track $index) {
                            <span [id]="'sentence-' + $index"
                                  (click)="seekAudio(s.startTime)"
                                  [class.bg-primary/20]="currentSentenceIndex() === $index"
                                  class="text-xl md:text-3xl font-medium text-gray-700 dark:text-slate-300 leading-relaxed cursor-pointer rounded-lg px-1 py-0.5">
                                {{ s.text }}
                            </span>
                          }
                        </div>
                      </div>
                  </div>
                }
                @case ('pov') {
                  <div class="space-y-6">
                    <div class="bg-indigo-50/50 dark:bg-indigo-500/5 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100/50">
                        <p class="text-lg md:text-xl font-medium text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                          Phần Point of View giúp bạn luyện tập ngữ pháp một cách tự nhiên bằng cách nghe lại câu chuyện ở các thời điểm khác nhau.
                        </p>
                    </div>
                    @if (activeSection().sentences?.length) {
                      <div class="bg-white dark:bg-white/5 p-8 md:p-14 rounded-[2.5rem] border border-gray-100 dark:border-white/10 relative overflow-hidden shadow-sm">
                        <div class="flex flex-wrap gap-x-2 gap-y-3">
                          @for (s of activeSection().sentences; track $index) {
                            <span [id]="'sentence-' + $index"
                                  (click)="seekAudio(s.startTime)"
                                  [class.bg-primary/20]="currentSentenceIndex() === $index"
                                  class="text-xl md:text-3xl font-medium text-gray-700 dark:text-slate-300 leading-relaxed cursor-pointer rounded-lg px-1 py-0.5 transition-colors">
                                {{ s.text }}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
                @case ('commentary') {
                  <div class="space-y-6">
                    <div class="p-8 bg-amber-50/50 dark:bg-amber-500/5 rounded-[2.5rem] border border-amber-100/50">
                        <p class="text-base md:text-lg text-amber-900/70 dark:text-amber-300/70 leading-relaxed italic">
                            Lắng nghe những chia sẻ thêm từ giáo viên về chủ đề của bài học.
                        </p>
                    </div>
                    @if (activeSection().sentences?.length) {
                      <div class="bg-white dark:bg-white/5 p-8 md:p-14 rounded-[2.5rem] border border-gray-100 dark:border-white/10 relative overflow-hidden shadow-sm">
                        <div class="flex flex-wrap gap-x-2 gap-y-3">
                          @for (s of activeSection().sentences; track $index) {
                            <span [id]="'sentence-' + $index"
                                  (click)="seekAudio(s.startTime)"
                                  [class.bg-primary/20]="currentSentenceIndex() === $index"
                                  class="text-xl md:text-3xl font-medium text-gray-700 dark:text-slate-300 leading-relaxed cursor-pointer rounded-lg px-1 py-0.5 transition-colors">
                                {{ s.text }}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
            }
          </div>
      </main>

      <footer class="absolute bottom-0 left-0 right-0 h-24 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 z-[40] px-4 md:px-10 flex items-center">
          <div class="max-w-7xl mx-auto w-full flex items-center gap-4 md:gap-12">
            <div class="hidden sm:flex items-center gap-4 w-64 shrink-0">
                <div class="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl">{{ activeSection().icon }}</div>
                <div class="min-w-0">
                  <p class="font-black text-sm text-gray-900 dark:text-white truncate">{{ activeSection().title }}</p>
                  <p class="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Playing...</p>
                </div>
            </div>

            <div class="flex-grow flex flex-col gap-2">
                <div class="flex items-center justify-center gap-8">
                  <button (click)="togglePlay()" class="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 hover:scale-105 transition-all">
                      @if (isPlaying()) {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      }
                  </button>
                </div>
                
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-bold text-gray-400 tabular-nums w-10">{{ formatTime(currentTime()) }}</span>
                  <div class="flex-grow h-1.5 bg-gray-100 dark:bg-white/10 rounded-full relative overflow-hidden cursor-pointer" (click)="onProgressBarClick($event)">
                      <div class="h-full bg-primary rounded-full transition-all duration-100" [style.width.%]="progress()"></div>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 tabular-nums w-10">{{ formatTime(duration()) }}</span>
                </div>
            </div>

            <div class="hidden sm:flex items-center justify-end gap-6 w-64 shrink-0">
                <button (click)="cyclePlaybackSpeed()" class="text-xs font-black px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 hover:text-primary transition-all">
                  {{ playbackSpeed() }}x
                </button>
            </div>
          </div>
      </footer>

      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="isMobileSidebarOpen()" 
           class="fixed inset-0 z-[150] lg:hidden animate-in fade-in duration-300">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="isMobileSidebarOpen.set(false)"></div>
          <aside class="absolute left-0 top-0 bottom-0 w-[280px] sm:w-80 bg-white dark:bg-[#1e293b] shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out">
              <div class="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                      <p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Học tập</p>
                      <h3 class="text-lg font-black text-gray-900 dark:text-white font-outfit">Nội dung bài học</h3>
                  </div>
                  <button (click)="isMobileSidebarOpen.set(false)" class="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>
              <nav class="p-4 space-y-2 overflow-y-auto scrollbar-hide flex-grow">
                  @for (section of sections(); track section.id) {
                      <button (click)="setActiveSection(section); isMobileSidebarOpen.set(false)"
                              [class.bg-primary/10]="activeSection().id === section.id"
                              [class.text-primary]="activeSection().id === section.id"
                              class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0"
                                [class.bg-primary/20]="activeSection().id === section.id">
                              <span class="text-xl">{{ section.icon }}</span>
                          </div>
                          <div class="min-w-0">
                              <p class="font-bold text-sm truncate" [class.text-gray-900]="activeSection().id !== section.id" [class.dark:text-white]="activeSection().id !== section.id">
                                  {{ section.title }}
                              </p>
                              <p class="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                                  {{ section.type }}
                              </p>
                          </div>
                      </button>
                  }
              </nav>
              <div class="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                  <p class="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Tiến độ bài học: {{ progress() | number:'1.0-0' }}%</p>
              </div>
          </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .font-merriweather { font-family: 'Merriweather', serif; }
  `]
})
export class LessonPlayerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private mediaService = inject(MediaService);
  private lessonService = inject(LessonService);
  private vocabService = inject(VocabularyService);

  lessonData = signal<any>(null);
  isMobileSidebarOpen = signal(false);
  activeStoryIndex = signal(0);
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  playbackSpeed = signal(1);
  isQuizOpen = signal(false);

  sections = computed<LessonSection[]>(() => {
    const lesson = this.lessonData();
    if (!lesson) return [];

    const list: LessonSection[] = [];
    
    // 1. Main Article
    list.push({
      id: 'article',
      title: 'Main Article',
      icon: '📄',
      type: 'article',
      audioUrl: lesson.main_audio_url,
      paragraphs: (lesson.main_content_bilingual || []).filter((p: any) => {
        const clean = (str: string) => str ? str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/gi, '').replace(/&#160;/gi, '').trim() : '';
        return clean(p.en) || clean(p.vi);
      })
    });

    // 2. Vocabulary
    list.push({
      id: 'vocab',
      title: 'Vocabulary',
      icon: '📚',
      type: 'vocab',
      audioUrl: lesson.vocab_audio_url
    });

    // 3. Mini Stories
    if (lesson.mini_stories && lesson.mini_stories.length > 0) {
      list.push({
        id: 'stories',
        title: 'Mini Stories',
        icon: '💬',
        type: 'story',
        audioUrl: lesson.mini_stories[0].audio_url,
        stories: lesson.mini_stories.map((ms: any) => ({
          id: ms.id,
          title: ms.title || 'Mini Story',
          audioUrl: ms.audio_url,
          vttUrl: ms.vtt_url,
          sentences: []
        }))
      });
    }

    // 4. POV
    if (lesson.pov_audio_url) {
      list.push({
        id: 'pov',
        title: 'Point of View',
        icon: '🔄',
        type: 'pov',
        audioUrl: lesson.pov_audio_url,
        vttUrl: lesson.pov_vtt_url,
        sentences: []
      });
    }

    // 5. Commentary
    if (lesson.commentary_audio_url) {
      list.push({
        id: 'commentary',
        title: 'Commentary',
        icon: '🎙️',
        type: 'commentary',
        audioUrl: lesson.commentary_audio_url,
        vttUrl: lesson.commentary_vtt_url,
        sentences: []
      });
    }

    return list;
  });

  activeSection = signal<LessonSection>(null as any);
  
  progress = computed(() => {
    const d = this.duration();
    if (d === 0) return 0;
    return (this.currentTime() / d) * 100;
  });

  private audio = new Audio();

  currentStory = computed(() => {
    const section = this.activeSection();
    if (section?.type === 'story' && section.stories) {
      return section.stories[this.activeStoryIndex()];
    }
    return null;
  });

  currentSentenceIndex = computed(() => {
    const section = this.activeSection();
    if (!section) return -1;
    const time = this.currentTime();

    if (section.type === 'story' && section.stories) {
      const story = this.currentStory();
      if (!story) return -1;
      return story.sentences.findIndex(s => time >= s.startTime && time < s.endTime);
    }
    
    if (section.sentences) {
      return section.sentences.findIndex(s => time >= s.startTime && time < s.endTime);
    }

    return -1;
  });

  private scrollEffect = effect(() => {
    const index = this.currentSentenceIndex();
    if (index >= 0) {
      const element = document.getElementById(`sentence-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  ngOnInit() {
    const courseSlug = this.route.snapshot.paramMap.get('courseSlug');
    const lessonSlug = this.route.snapshot.paramMap.get('lessonSlug');

    if (courseSlug && lessonSlug) {
      this.lessonService.findOneBySlug(courseSlug, lessonSlug).subscribe(lesson => {
        this.lessonData.set(lesson);
        this.activeSection.set(this.sections()[0]);
        this.updateAudioSource();
      });
    }

    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('durationchange', () => this.duration.set(this.audio.duration));
    this.audio.addEventListener('ended', () => this.isPlaying.set(false));
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  setActiveSection(section: LessonSection) {
    this.audio.pause();
    this.isPlaying.set(false);
    this.activeSection.set(section);
    this.activeStoryIndex.set(0);
    this.updateAudioSource();
  }

  setActiveStory(index: number) {
    this.audio.pause();
    this.isPlaying.set(false);
    this.activeStoryIndex.set(index);
    this.updateAudioSource();
  }

  private updateAudioSource() {
    const section = this.activeSection();
    if (!section) return;

    let audioUrl = section.audioUrl;
    let vttUrl = section.vttUrl || '';

    if (section.type === 'story' && section.stories) {
      const story = section.stories[this.activeStoryIndex()];
      audioUrl = story.audioUrl;
      vttUrl = story.vttUrl || '';
    }

    if (audioUrl) {
      this.audio.src = this.getMediaUrl(audioUrl);
      this.audio.load();
      if (this.isPlaying()) {
        this.audio.play().catch(err => {
          console.error('Audio autoplay failed', err);
          this.isPlaying.set(false);
        });
      }
    } else {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.currentTime.set(0);
      this.duration.set(0);
    }

    if (vttUrl) {
      this.mediaService.fetchAndParseVtt(vttUrl).subscribe(sentences => {
        if (section.type === 'story' && section.stories) {
          section.stories[this.activeStoryIndex()].sentences = sentences;
        } else {
          section.sentences = sentences;
        }
      });
    }
  }

  getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${environment.apiBaseUrl}${path}`;
    
    if (!path.includes('/')) {
      return `${environment.apiBaseUrl}/media/audio/${path}`;
    }
    return `${environment.apiBaseUrl}/media/${path}`;
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
      this.isPlaying.set(false);
    } else {
      this.audio.play().then(() => {
        this.isPlaying.set(true);
      }).catch(err => {
        console.error('Playback failed', err);
        this.isPlaying.set(false);
      });
    }
  }

  playVocabAudio(vocab: any) {
    if (!vocab.audio_url) return;
    const url = this.getMediaUrl(vocab.audio_url);
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Vocab audio play failed', err));
  }

  addToStudy(vocabId: string) {
    this.vocabService.learn(vocabId).subscribe({
      next: () => {
        console.log('Đã thêm từ vựng vào danh sách học');
      },
      error: (err) => {
        console.error('Lỗi khi thêm từ vựng:', err);
      }
    });
  }

  seekAudio(time: number) {
    this.audio.currentTime = time;
    this.currentTime.set(time);
    if (!this.isPlaying()) this.togglePlay();
  }

  onProgressBarClick(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    this.seekAudio(percentage * this.duration());
  }

  cyclePlaybackSpeed() {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextSpeed = speeds[(speeds.indexOf(this.playbackSpeed()) + 1) % speeds.length];
    this.playbackSpeed.set(nextSpeed);
    this.audio.playbackRate = nextSpeed;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
