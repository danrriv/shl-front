# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`shl` is the Angular 22 frontend for a URL shortener. It is server-rendered (SSR) via `@angular/ssr` + Express and talks to a separate backend API (Spring-style; default `http://localhost:8312`). Authentication is Google OAuth2 handled entirely by the backend via session cookies — the frontend never holds a token.

## Commands

```bash
npm start            # ng serve — dev server at http://localhost:4200
npm run build        # production build (SSR) into dist/shl
npm run watch        # incremental dev build
npm test             # ng test — Vitest runner
npm run serve:ssr:shl  # run the built SSR server (dist/shl/server/server.mjs)
```

Run a single test with Vitest filters via the ng test builder, e.g. `ng test --include src/app/app.spec.ts` or pass `-t "name"` to match a test by title. Specs are colocated as `*.spec.ts`.

## Architecture

- **Auth is cookie-based, backend-driven.** `AuthService.login()`/`logout()` do a full-page redirect to backend OAuth/logout endpoints. There is no client token. Every authenticated request must send `withCredentials: true` — the global `authInterceptor` (`core/interceptors/auth.interceptor.ts`) clones each request to add it, and services also set it explicitly. `authGuard` calls `AuthService.checkAuthStatus()` (`GET /api/user/me`) and redirects to `/login` on failure.
- **Routing has two layout shells** (`app.routes.ts`): `PublicLayout` (home, auth — lazy `home.routes`/`auth.routes`) and `AuthLayout` (guarded by `authGuard`; lazy `dashboard.routes`/`links.routes`). Feature routes are always lazy-loaded via `loadChildren`.
- **SSR render modes are explicit** (`app.routes.server.ts`): public/auth pages are `Prerender`; `dashboard` and `links/**` are `Server`-rendered (they depend on the session cookie). Hydration uses `withEventReplay()` and `withNoIncrementalHydration()`.
- **API access goes through `core/services/`** (`LinkService`, `AuthService`, etc.). All build URLs from `environment.apiUrl`. Anonymous link creation (`POST /api/links/anonymous`) is the one endpoint that does not send credentials.
- **Environments** (`src/environments/`) only carry `apiUrl`; `angular.json` swaps `environment.ts` → `environment.production.ts` for prod builds.

## Conventions (from AGENTS.md)

This repo follows Angular v20+ standalone/signals style strictly. Key rules:

- Standalone components only; **do not** write `standalone: true` (it's the default). Use `inject()`, not constructor injection.
- Signals for state; `computed()` for derived; never `.mutate()` (use `set`/`update`). Services are `providedIn: 'root'`.
- All components use `ChangeDetectionStrategy.OnPush`.
- Native control flow (`@if`/`@for`/`@switch`), never `*ngIf`/`*ngFor`. Use `class`/`style` bindings, never `ngClass`/`ngStyle`.
- `input()`/`output()` functions, not `@Input`/`@Output`. Host bindings go in the `host` object, never `@HostBinding`/`@HostListener`.
- **Selector prefixes:** UI primitives under `shared/components/ui/` use `ui-` (e.g. `ui-button`); all other components use `app-`.
- Reactive forms over template-driven. Avoid `any` (use `unknown`). Must pass AXE / WCAG AA.

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss` (configured in `.postcssrc.json`, single entry `src/styles.css`). Theme tokens like `primary-600` are used directly in component templates.
