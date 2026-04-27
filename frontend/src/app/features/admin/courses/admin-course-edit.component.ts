import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService, Course } from '../../../core/services/course.service';
import { MediaUrlPipe } from '../../../shared/pipes/media-url.pipe';
import { tap } from 'rxjs';

@Component({
  selector: 'app-admin-course-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MediaUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
        <!-- Header -->
        <header class="flex items-center gap-6">
            <button routerLink="/admin/courses" 
                    class="w-12 h-12 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:scale-110 active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div>
                <h2 class="text-3xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">
                    {{ isEdit() ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học mới' }} ✏️
                </h2>
                <p class="text-gray-500 dark:text-gray-400 font-medium">Cập nhật lại thông tin và hình ảnh của khóa học.</p>
            </div>
        </header>

        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Left Column: Main Info -->
            <div class="lg:col-span-2 space-y-8 bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                <div class="space-y-6 relative">
                    <!-- Title -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tiêu đề khóa học</label>
                        <input type="text" formControlName="title"
                               class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-2xl py-5 px-8 text-xl font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-gray-300">
                        <div class="flex items-center gap-2 ml-2">
                           <span class="text-[10px] font-bold text-gray-400">Đường dẫn thân thiện:</span>
                           <span class="text-[10px] font-black text-rose-500 tabular-nums">/courses/{{ slugPreview() }}</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Mô tả tóm tắt</label>
                        <textarea formControlName="description" rows="5"
                                  class="w-full bg-gray-50 dark:bg-white/2 border-none rounded-3xl py-5 px-8 text-lg font-medium text-gray-600 dark:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-gray-300"></textarea>
                    </div>

                    <!-- Level Selection -->
                    <div class="space-y-4">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Cấp độ</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            @for (lvl of levels; track lvl) {
                                <button type="button" 
                                        (click)="setLevel(lvl)"
                                        [ngClass]="courseForm.get('level')?.value === lvl ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'"
                                        class="py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                    {{ lvl }}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Sidebar -->
            <div class="space-y-6">
                <!-- Thumbnail Card -->
                <div class="bg-white dark:bg-[#1e293b] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none text-center space-y-6">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ảnh Thumbnail</label>
                    
                    <div class="aspect-video rounded-[2rem] bg-gray-50 dark:bg-white/2 border-2 border-dashed border-gray-100 dark:border-white/10 overflow-hidden group relative">
                        @if (courseForm.get('thumbnail')?.value) {
                            <img [src]="courseForm.get('thumbnail')?.value | mediaUrl" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        } @else {
                            <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-xs font-black uppercase tracking-widest">Chưa có ảnh</span>
                            </div>
                        }
                        
                        <!-- Upload Overlay -->
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button type="button" (click)="fileInput.click()" 
                                    class="bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm hover:scale-110 transition-transform">
                                Thay đổi ảnh
                            </button>
                        </div>

                        @if (isUploading()) {
                            <div class="absolute inset-0 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                                <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span class="text-[10px] font-black uppercase tracking-widest text-primary">Đang tải lên...</span>
                            </div>
                        }
                    </div>

                    <div class="space-y-2">
                        <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
                        <button type="button" (click)="fileInput.click()"
                                class="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                            Chọn ảnh từ máy tính
                        </button>
                        <p class="text-[10px] text-gray-400 font-medium italic">* Khuyên dùng ảnh tỉ lệ 16:9, định dạng .webp hoặc .png</p>
                    </div>

                    <div class="pt-4 space-y-3">
                        <button type="submit" [disabled]="courseForm.invalid"
                                class="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                            💾 Lưu thay đổi
                        </button>
                        <button type="button" routerLink="/admin/courses"
                                class="w-full py-4 text-gray-400 dark:text-gray-500 font-bold hover:text-gray-900 dark:hover:text-white transition-colors">
                            Hủy bỏ
                        </button>
                    </div>
                </div>

                <!-- Status Badge -->
                <div class="bg-emerald-50 dark:bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/10 flex items-center justify-center gap-3">
                    <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Trạng thái: Sẵn sàng</span>
                </div>
            </div>
        </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminCourseEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  courseId = signal<string | null>(null);
  slugPreview = signal('');
  isUploading = signal(false);

  levels = ['Cơ bản', 'Trung cấp', 'Nâng cao', 'Mọi cấp độ'];

  courseForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    level: ['Cơ bản'],
    thumbnail: [''],
    slug: ['']
  });

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEdit.set(true);
      this.courseService.findOneBySlug(slug).subscribe(course => {
        this.courseId.set(course.id);
        this.courseForm.patchValue(course);
        this.slugPreview.set(course.slug);
      });
    }

    // Slug preview logic
    this.courseForm.get('title')?.valueChanges.subscribe(title => {
      if (!this.isEdit() || !this.courseForm.get('slug')?.dirty) {
        const slug = this.slugify(title || '');
        this.slugPreview.set(slug);
        this.courseForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });

    this.courseForm.get('slug')?.valueChanges.subscribe(slug => {
      this.slugPreview.set(slug || '');
    });
  }

  setLevel(level: string) {
    this.courseForm.get('level')?.setValue(level);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const slug = this.slugPreview();
    if (!slug) {
      alert('Vui lòng nhập tiêu đề khóa học trước khi tải ảnh lên.');
      return;
    }

    this.isUploading.set(true);
    this.courseService.uploadThumbnail(slug, file).subscribe({
      next: (url) => {
        this.courseForm.get('thumbnail')?.setValue(url);
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('Tải ảnh lên thất bại. Vui lòng thử lại.');
        this.isUploading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    const data = this.courseForm.value;
    if (this.isEdit()) {
      this.courseService.update(this.courseId()!, data as any).subscribe(() => {
        this.router.navigate(['/admin/courses']);
      });
    } else {
      this.courseService.create(data as any).subscribe(() => {
        this.router.navigate(['/admin/courses']);
      });
    }
  }

  private slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
}
