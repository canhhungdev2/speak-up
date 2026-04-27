import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard';
import { AdminCourseListComponent } from './courses/admin-course-list.component';
import { AdminCourseEditComponent } from './courses/admin-course-edit.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'courses', component: AdminCourseListComponent },
      { path: 'courses/new', component: AdminCourseEditComponent },
      { path: 'courses/edit/:slug', component: AdminCourseEditComponent },
    ]
  },
];
