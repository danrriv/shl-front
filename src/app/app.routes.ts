import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES) },
      { path: '', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
      { path: 'links', loadChildren: () => import('./features/links/links.routes').then((m) => m.LINKS_ROUTES) },
    ],
  },
];
