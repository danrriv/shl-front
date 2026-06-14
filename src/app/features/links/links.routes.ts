import { Routes } from '@angular/router';
import { CreateLink } from './create-link';
import { EditLink } from './edit-link';

export const LINKS_ROUTES: Routes = [
  { path: 'new', component: CreateLink },
  { path: ':id/edit', component: EditLink },
];
