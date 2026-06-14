import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'callback', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Server },
  { path: 'links/new', renderMode: RenderMode.Server },
  { path: 'links/**', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
