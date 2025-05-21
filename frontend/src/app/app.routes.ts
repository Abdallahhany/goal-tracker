import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard],
    data: { guestOnly: true },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [AuthGuard],
    data: { guestOnly: true },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { authOnly: true },
  },
  {
    path: 'public',
    loadComponent: () =>
      import('./public-goals/public-goals.component').then((m) => m.PublicGoalsComponent),
  },
  {
    path: 'public/:id',
    loadComponent: () =>
      import('./public-goals/goal-view/goal-view.component').then((m) => m.GoalViewComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];