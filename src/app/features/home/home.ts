import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { LinkService } from '@core/services/link.service';
import { ClipboardService } from '@core/services/clipboard.service';
import { LinkResponse } from '@core/models/link.model';
import { Input } from '@shared/components/ui/input/input';
import { Button } from '@shared/components/ui/button/button';

const HISTORY_KEY = 'shl-history';

@Component({
  selector: 'app-home',
  imports: [Input, Button],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly #linkService = inject(LinkService);
  readonly #clipboard = inject(ClipboardService);

  readonly url = signal('');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly history = signal<LinkResponse[]>(this.#loadHistory());
  readonly copiedSignal = this.#clipboard.copied;

  constructor() {
    effect(() => this.#saveHistory(this.history()));
  }

  #loadHistory(): LinkResponse[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as LinkResponse[]) : [];
    } catch {
      return [];
    }
  }

  #saveHistory(items: LinkResponse[]): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      // localStorage not available or full
    }
  }

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
        this.history.update((h) => [link, ...h]);
        this.url.set('');
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
