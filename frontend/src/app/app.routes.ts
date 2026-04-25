import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { RegisterComponent } from './features/auth/register.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'learner', 
    loadChildren: () => import('./features/learner/learner.routes').then(m => m.LEARNER_ROUTES) 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) 
  }
];
