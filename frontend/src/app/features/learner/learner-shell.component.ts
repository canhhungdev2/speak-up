import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LearnerLayoutComponent } from './layout/learner-layout.component';

@Component({
  selector: 'app-learner-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, LearnerLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-learner-layout>
      <router-outlet></router-outlet>
    </app-learner-layout>
  `
})
export class LearnerShellComponent {}
