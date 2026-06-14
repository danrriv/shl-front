import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LinkService } from '../../core/services/link.service';
import { LinkResponse } from '../../core/models/link.model';
import { LinkCard } from '../../shared/components/link-card/link-card';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, LinkCard, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly #linkService = inject(LinkService);
  readonly #router = inject(Router);

  readonly links = signal<LinkResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly hasLinks = computed(() => this.links().length > 0);

  constructor() {
    this.loadLinks();
  }

  loadLinks(): void {
    this.loading.set(true);
    this.error.set('');

    this.#linkService.findAll(this.page()).subscribe({
      next: (res) => {
        this.links.set(res.content);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los links');
        this.loading.set(false);
      },
    });
  }

  editLink(link: LinkResponse): void {
    this.#router.navigate(['/links', link.id, 'edit']);
  }

  deleteLink(link: LinkResponse): void {
    if (!confirm('¿Eliminar este link?')) return;

    this.#linkService.delete(link.id).subscribe({
      next: () => {
        this.links.update((list) => list.filter((l) => l.id !== link.id));
      },
      error: () => {
        this.error.set('Error al eliminar el link');
      },
    });
  }

  prevPage(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
      this.loadLinks();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p) => p + 1);
      this.loadLinks();
    }
  }
}
