import { Routes } from '@angular/router';
import { LearnerDashboardComponent } from './dashboard';
import { CourseListComponent } from './courses/course-list.component';

export const LEARNER_ROUTES: Routes = [
  { path: '', component: LearnerDashboardComponent },
  { path: 'courses', component: CourseListComponent },
];
