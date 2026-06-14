import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LinkService } from '../../core/services/link.service';

@Component({
  selector: 'app-create-link',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-link.html',
  styleUrl: './create-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLink {
  readonly #linkService = inject(LinkService);
  readonly #router = inject(Router);

  readonly originalUrl = signal('');
  readonly shortCode = signal('');
  readonly expiresAt = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  submit(): void {
    const url = this.originalUrl().trim();
    if (!url) {
      this.error.set('La URL es requerida');
      return;
    }

    try {
      new URL(url);
    } catch {
      this.error.set('URL inválida');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const request = {
      originalUrl: url,
      shortCode: this.shortCode().trim() || undefined,
      expiresAt: this.expiresAt() || undefined,
    };

    this.#linkService.create(request).subscribe({
      next: () => {
        this.#router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el link');
        this.loading.set(false);
      },
    });
  }
}
