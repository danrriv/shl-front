import { Routes } from '@angular/router';
import { Login } from './login';
import { Callback } from './callback';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'callback', component: Callback },
];
