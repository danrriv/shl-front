import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkService } from '../../core/services/link.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { LinkResponse } from '../../core/models/link.model';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly #linkService = inject(LinkService);
  readonly #clipboard = inject(ClipboardService);

  readonly url = signal('');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly createdLink = signal<LinkResponse | null>(null);
  readonly copiedSignal = this.#clipboard.copied;

  submit(): void {
    const value = this.url().trim();
    if (!value) {
      this.error.set('Ingresa una URL');
      return;
    }

    try {
      new URL(value);
    } catch {
      this.error.set('URL inválida');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.#linkService.createAnonymous({ originalUrl: value }).subscribe({
      next: (link) => {
        this.createdLink.set(link);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al acortar el link. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }

  copy(shortUrl: string): void {
    this.#clipboard.copy(shortUrl);
  }
}
