import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LearnerLayoutComponent } from '../layout/learner-layout.component';

interface LessonSection {
  id: string;
  title: string;
  icon: string;
  type: 'article' | 'vocab' | 'story' | 'pov' | 'commentary';
  audioUrl: string;
  content?: string;
  vocabList?: { term: string; definition: string; }[];
  stories?: { id: string; title: string; transcript: string; audioUrl: string; }[];
}

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [CommonModule, RouterModule, LearnerLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-learner-layout [isSlim]="true" [title]="lessonTitle()" (onBack)="goBack()">
      <div class="flex h-[calc(100vh-6rem)] overflow-hidden relative">
        
        <!-- Mobile Section Selector (Floating Button) -->
        <button (click)="isSectionMenuOpen.set(true)" 
                class="lg:hidden fixed bottom-32 right-6 w-14 h-14 bg-white dark:bg-[#1e293b] shadow-2xl rounded-full flex items-center justify-center text-primary z-[105] border border-gray-100 dark:border-white/10 active:scale-95 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
           </svg>
        </button>

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
                      @if (isCompleted(section.id)) {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      }
                   </button>
                }
             </nav>
          </div>
        </aside>

        <!-- Mobile Drawer for Sections -->
        <div *ngIf="isSectionMenuOpen()" 
             (click)="isSectionMenuOpen.set(false)"
             class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex flex-col justify-end">
           <div (click)="$event.stopPropagation()"
                class="bg-white dark:bg-[#0f172a] rounded-t-[3rem] p-8 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div class="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-8"></div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white mb-6 font-outfit px-2">Chọn phần bài học</h3>
              <nav class="space-y-2">
                @for (section of sections(); track section.id) {
                   <button (click)="setActiveSection(section); isSectionMenuOpen.set(false)"
                           [class.bg-primary/10]="activeSection().id === section.id"
                           [class.text-primary]="activeSection().id === section.id"
                           class="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group border border-transparent"
                           [class.border-primary/20]="activeSection().id === section.id">
                      <span class="text-2xl">{{ section.icon }}</span>
                      <div class="flex-grow">
                         <p class="font-black text-base">{{ section.title }}</p>
                         <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{{ section.type }}</p>
                      </div>
                      @if (isCompleted(section.id)) {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      }
                   </button>
                }
              </nav>
           </div>
        </div>

        <!-- Main Content Area -->
        <main class="flex-grow overflow-y-auto p-4 md:p-12 bg-gray-50 dark:bg-transparent relative scrollbar-hide">
           <div class="max-w-3xl mx-auto pb-40 md:pb-32">
              
              <!-- Section Header -->
              <div class="mb-8 md:mb-12">
                 <span class="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                    {{ activeSection().type }}
                 </span>
                 <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-outfit tracking-tight leading-tight">
                    {{ activeSection().title }}
                 </h1>
              </div>

              <!-- Content Switcher -->
              @switch (activeSection().type) {
                 @case ('article') {
                    <div class="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif text-gray-700 dark:text-slate-300 leading-relaxed space-y-6">
                       {{ activeSection().content }}
                    </div>
                 }
                 @case ('vocab') {
                    <div class="space-y-6">
                       <p class="text-base md:text-lg text-gray-500 dark:text-slate-400 mb-8 italic">
                          Nghe giải thích chi tiết các từ vựng quan trọng xuất hiện trong bài học này.
                       </p>
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          @for (vocab of activeSection().vocabList; track vocab.term) {
                             <div class="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] hover:border-primary/30 transition-all group">
                                <div class="flex justify-between items-start mb-2">
                                   <h3 class="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                      {{ vocab.term }}
                                   </h3>
                                   <button class="p-2 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                      </svg>
                                   </button>
                                </div>
                                <p class="text-gray-500 dark:text-slate-400 font-medium">{{ vocab.definition }}</p>
                             </div>
                          }
                       </div>
                    </div>
                 }
                 @case ('story') {
                    <div class="space-y-8 md:space-y-12">
                       <!-- Story Tabs -->
                       <div class="flex gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl w-full md:w-fit overflow-x-auto scrollbar-hide">
                          @for (story of activeSection().stories; track story.id; let i = $index) {
                             <button (click)="activeStoryIndex.set(i)"
                                     [class.bg-white]="activeStoryIndex() === i"
                                     [class.dark:bg-white/10]="activeStoryIndex() === i"
                                     [class.shadow-sm]="activeStoryIndex() === i"
                                     class="px-5 py-2.5 rounded-xl font-bold text-sm transition-all text-gray-500 dark:text-slate-400 whitespace-nowrap"
                                     [class.text-primary]="activeStoryIndex() === i">
                                Story {{ i + 1 }}
                             </button>
                          }
                       </div>

                       <div class="bg-white dark:bg-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 dark:border-white/10 relative overflow-hidden">
                          <p class="text-xl md:text-2xl font-medium text-gray-700 dark:text-slate-300 leading-loose italic">
                             {{ activeSection().stories?.[activeStoryIndex()]?.transcript }}
                          </p>
                       </div>
                    </div>
                 }
                 @case ('pov') {
                    <div class="bg-indigo-50/50 dark:bg-indigo-500/5 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-500/10">
                       <p class="text-lg md:text-xl font-medium text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                          {{ activeSection().content }}
                       </p>
                    </div>
                 }
                 @case ('commentary') {
                    <div class="space-y-8">
                       <div class="p-8 bg-amber-50/50 dark:bg-amber-500/5 rounded-[2.5rem] border border-amber-100/50 dark:border-amber-500/10">
                          <p class="text-base md:text-lg text-amber-900/70 dark:text-amber-300/70 leading-relaxed italic">
                             Phần bình luận giúp bạn hiểu sâu hơn về văn hóa và cách dùng từ trong thực tế.
                          </p>
                       </div>
                    </div>
                 }
              }
           </div>
        </main>

        <!-- Premium Global Audio Player -->
        <footer class="fixed bottom-0 left-0 right-0 h-24 md:h-28 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 z-[110] px-4 md:px-10 flex items-center">
           <div class="max-w-7xl mx-auto w-full flex items-center gap-4 md:gap-12">
              
              <!-- Track Info (Hidden on very small screens) -->
              <div class="hidden sm:flex items-center gap-3 md:gap-4 w-40 md:w-64 shrink-0">
                 <div class="w-10 h-10 md:w-14 md:h-14 bg-primary/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">
                    {{ activeSection().icon }}
                 </div>
                 <div class="min-w-0">
                    <p class="font-black text-xs md:text-sm text-gray-900 dark:text-white truncate">{{ activeSection().title }}</p>
                    <p class="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Playing...</p>
                 </div>
              </div>

              <!-- Main Controls -->
              <div class="flex-grow flex flex-col gap-1 md:gap-2">
                 <div class="flex items-center justify-center gap-4 md:gap-8">
                    <button class="text-gray-400 hover:text-primary transition-colors hidden xs:block">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                       </svg>
                    </button>
                    <button (click)="togglePlay()" class="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                       @if (isPlaying()) {
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                       } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                       }
                    </button>
                    <button class="text-gray-400 hover:text-primary transition-colors hidden xs:block">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                       </svg>
                    </button>
                 </div>
                 
                 <!-- Progress Bar -->
                 <div class="flex items-center gap-3 md:gap-4">
                    <span class="text-[9px] md:text-[10px] font-bold text-gray-400 tabular-nums w-7 md:w-8">1:24</span>
                    <div class="flex-grow h-1 md:h-1.5 bg-gray-100 dark:bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
                       <div class="h-full bg-primary w-[40%] rounded-full relative"></div>
                    </div>
                    <span class="text-[9px] md:text-[10px] font-bold text-gray-400 tabular-nums w-7 md:w-8">4:30</span>
                 </div>
              </div>

              <!-- Extra Controls (Hidden on mobile) -->
              <div class="hidden sm:flex items-center justify-end gap-3 md:gap-6 w-24 md:w-64 shrink-0">
                 <button (click)="cyclePlaybackSpeed()" class="text-[10px] md:text-xs font-black px-2 md:px-3 py-1 md:py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 hover:text-primary transition-all">
                    {{ playbackSpeed() }}x
                 </button>
                 <div class="hidden lg:flex items-center gap-2 group">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m0 0v.001M12 6v.001m0-.001v-.001M12 18v.001" />
                    </svg>
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </app-learner-layout>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class LessonPlayerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  lessonTitle = signal('The Power of Persistence');
  isSectionMenuOpen = signal(false);
  activeStoryIndex = signal(0);
  isPlaying = signal(false);
  playbackSpeed = signal(1);

  sections = signal<LessonSection[]>([
    {
      id: 'article',
      title: 'Main Article',
      icon: '📄',
      type: 'article',
      audioUrl: 'article.mp3',
      content: `The power of persistence is one of the most important qualities of successful people. 
      When we talk about persistence, we mean the ability to continue doing something even when it is difficult.
      Many people give up when they face challenges, but those who succeed are the ones who keep going.
      
      Persistence is not about being the smartest or the fastest. It is about being the most consistent.
      Consistency leads to habits, and habits lead to mastery. If you practice English for just 15 minutes
      every single day, you will be much better than someone who practices for 5 hours once a month.`
    },
    {
      id: 'vocab',
      title: 'Vocabulary',
      icon: '📚',
      type: 'vocab',
      audioUrl: 'vocab.mp3',
      vocabList: [
        { term: 'Persistence', definition: 'Sự kiên trì, bền bỉ (The quality of continuing to do something)' },
        { term: 'Mastery', definition: 'Sự tinh thông, làm chủ (Great skill or knowledge of something)' },
        { term: 'Consistent', definition: 'Nhất quán, đều đặn (Always behaving or happening in a similar way)' },
        { term: 'Challenge', definition: 'Thử thách (A task or situation that tests someone\'s abilities)' },
      ]
    },
    {
      id: 'stories',
      title: 'Mini Stories',
      icon: '💬',
      type: 'story',
      audioUrl: 'story1.mp3',
      stories: [
        { 
          id: 's1', 
          title: 'The Persistent Turtle', 
          audioUrl: 'story1.mp3',
          transcript: 'There was a turtle named Toby. Toby wanted to climb a mountain. All the other animals laughed at him. "You are too slow," they said. But Toby was persistent. He moved one inch at a time. Every day, he kept going. Finally, after many months, he reached the top!'
        },
        { 
          id: 's2', 
          title: 'The Golden Goal', 
          audioUrl: 'story2.mp3',
          transcript: 'In another part of the forest, a rabbit was trying to find a golden carrot. He ran very fast but got tired easily. When he faced a river, he gave up. But the turtle, who was behind him, found a way to swim across because he didn\'t stop thinking about the goal.'
        }
      ]
    },
    {
      id: 'pov',
      title: 'Point of View',
      icon: '🔄',
      type: 'pov',
      audioUrl: 'pov.mp3',
      content: 'In this version, I will tell the story from the future. Toby will have already climbed the mountain. He had been very persistent for many months before he finally reached the peak. Everyone had laughed at him, but he didn\'t care.'
    },
    {
      id: 'commentary',
      title: 'Commentary',
      icon: '🎙️',
      type: 'commentary',
      audioUrl: 'commentary.mp3',
      content: 'Hello everyone, welcome to the commentary for this lesson. Today I want to talk about why so many students fail to reach fluency. It is usually not a lack of talent, but a lack of persistence...'
    }
  ]);

  activeSection = signal<LessonSection>(this.sections()[0]);
  completedSections = signal<Set<string>>(new Set());

  setActiveSection(section: LessonSection) {
    this.activeSection.set(section);
    this.activeStoryIndex.set(0);
    // Logic to load new audio would go here
  }

  togglePlay() {
    this.isPlaying.update(v => !v);
  }

  cyclePlaybackSpeed() {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const current = this.playbackSpeed();
    const nextIndex = (speeds.indexOf(current) + 1) % speeds.length;
    this.playbackSpeed.set(speeds[nextIndex]);
  }

  isCompleted(id: string) {
    return this.completedSections().has(id);
  }

  goBack() {
    this.router.navigate(['/learner/courses', '1']); // Mock ID
  }
}
