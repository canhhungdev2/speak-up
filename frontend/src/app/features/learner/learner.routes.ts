import { Routes } from '@angular/router';
import { LearnerDashboardComponent } from './dashboard';
import { CourseListComponent } from './courses/course-list.component';
import { LessonListComponent } from './courses/lesson-list.component';
import { VocabularyListComponent } from './vocabulary/vocabulary-list.component';
import { StudyComponent } from './vocabulary/study.component';

export const LEARNER_ROUTES: Routes = [
  { path: '', component: LearnerDashboardComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:id', component: LessonListComponent },
  { path: 'vocabulary', component: VocabularyListComponent },
  { path: 'vocabulary/study', component: StudyComponent },
];
