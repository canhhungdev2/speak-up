import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard';
import { AdminCourseListComponent } from './courses/admin-course-list.component';
import { AdminCourseEditComponent } from './courses/admin-course-edit.component';
import { AdminLessonListComponent } from './lessons/admin-lesson-list.component';
import { AdminLessonEditComponent } from './lessons/admin-lesson-edit.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'courses', component: AdminCourseListComponent },
      { path: 'courses/new', component: AdminCourseEditComponent },
      { path: 'courses/edit/:slug', component: AdminCourseEditComponent },
      { path: 'courses/:courseSlug/lessons', component: AdminLessonListComponent },
      { path: 'courses/:courseSlug/lessons/new', component: AdminLessonEditComponent },
      { path: 'courses/:courseSlug/lessons/edit/:lessonSlug', component: AdminLessonEditComponent },
    ]
  },
];
