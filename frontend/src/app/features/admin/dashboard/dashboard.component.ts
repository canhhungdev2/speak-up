import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './stat-card.component';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 pb-10">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card 
          label="Tổng học viên" 
          value="2,380" 
          [trend]="12" 
          color="rose"
          icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' />
        
        <app-stat-card 
          label="Khóa học hiện có" 
          [value]="courses().length" 
          color="purple"
          icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>' />

        <app-stat-card 
          label="Tỷ lệ hoàn thành" 
          value="60" 
          suffix="%"
          [trend]="5.4" 
          color="emerald"
          icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' />

        <app-stat-card 
          label="Doanh thu tháng này" 
          value="324.70" 
          suffix="$"
          [trend]="-2.1" 
          color="blue"
          icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' />
      </div>


      <!-- Main Section - Placeholder for other dashboard features -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- You can add charts or latest activities here in the future -->
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  courses = this.courseService.courses;

  ngOnInit() {
    this.courseService.findAll().subscribe();
  }
}
