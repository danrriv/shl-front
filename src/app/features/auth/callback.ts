import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="flex flex-col items-center justify-center py-16">
      @if (error()) {
        <h1 class="text-xl font-semibold text-red-600">Error de autenticación</h1>
        <p class="mt-2 text-paper-500">{{ error() }}</p>
      } @else {
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" role="status">
          <span class="sr-only">Autenticando...</span>
        </div>
        <p class="mt-4 text-paper-500">Verificando identidad...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Callback {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  readonly error = signal('');

  constructor() {
    this.#authService.checkAuthStatus().subscribe({
      next: (user) => {
        if (user) {
          this.#router.navigate(['/dashboard']);
        } else {
          this.error.set('No se pudo iniciar sesión. Intenta de nuevo.');
        }
      },
    });
  }
}
