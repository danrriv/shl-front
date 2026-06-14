import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LinkService } from '@core/services/link.service';
import { LinkResponse } from '@core/models/link.model';

@Component({
  selector: 'app-edit-link',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-link.html',
  styleUrl: './edit-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLink {
  readonly #linkService = inject(LinkService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  readonly link = signal<LinkResponse | null>(null);
  readonly originalUrl = signal('');
  readonly expiresAt = signal('');
  readonly isActive = signal(true);
  readonly loading = signal(false);
  readonly loadingData = signal(true);
  readonly error = signal('');

  readonly title = computed(() => this.link() ? `Editar: ${this.link()!.shortCode}` : 'Editar link');

  constructor() {
    const id = Number(this.#route.snapshot.paramMap.get('id'));
    if (!id) {
      this.#router.navigate(['/dashboard']);
      return;
    }

    this.#linkService.findById(id).subscribe({
      next: (link) => {
        this.link.set(link);
        this.originalUrl.set(link.originalUrl);
        this.expiresAt.set(link.expiresAt ? link.expiresAt.substring(0, 16) : '');
        this.isActive.set(link.isActive);
        this.loadingData.set(false);
      },
      error: () => {
        this.error.set('Link no encontrado');
        this.loadingData.set(false);
      },
    });
  }

  submit(): void {
    const url = this.originalUrl().trim();
    if (!url) {
      this.error.set('La URL es requerida');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.#linkService.update(this.link()!.id, {
      originalUrl: url,
      expiresAt: this.expiresAt() || null,
      isActive: this.isActive(),
    }).subscribe({
      next: () => {
        this.#router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al actualizar');
        this.loading.set(false);
      },
    });
  }
}
