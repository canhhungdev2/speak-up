import { Routes } from '@angular/router';
import { LearnerDashboardComponent } from './dashboard';
import { CourseListComponent } from './courses/course-list.component';
import { LessonListComponent } from './courses/lesson-list.component';
import { LessonPlayerComponent } from './courses/lesson-player.component';
import { VocabularyListComponent } from './vocabulary/vocabulary-list.component';
import { StudyComponent } from './vocabulary/study.component';

import { LearnerShellComponent } from './learner-shell.component';

export const LEARNER_ROUTES: Routes = [
  {
    path: '',
    component: LearnerShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: LearnerDashboardComponent },
      { path: 'courses', component: CourseListComponent },
      { path: 'courses/:id', component: LessonListComponent },
      { path: 'lesson/:id', component: LessonPlayerComponent },
      { path: 'vocabulary', component: VocabularyListComponent },
      { path: 'vocabulary/study', component: StudyComponent },
    ]
  }
];
