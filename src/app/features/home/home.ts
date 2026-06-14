import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from 'angularx-qrcode';
import { LinkService } from '@core/services/link.service';
import { ClipboardService } from '@core/services/clipboard.service';
import { QRService } from '@core/services/qr.service';
import { LinkResponse } from '@core/models/link.model';
import { Input } from '@shared/components/ui/input/input';
import { Button } from '@shared/components/ui/button/button';

const HISTORY_KEY = 'shl-history';

@Component({
  selector: 'app-home',
  imports: [Input, Button, QRCodeComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly #linkService = inject(LinkService);
  readonly #clipboard = inject(ClipboardService);
  readonly #qrService = inject(QRService);

  readonly url = signal('');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly history = signal<LinkResponse[]>(this.#loadHistory());
  readonly copiedSignal = this.#clipboard.copied;
  readonly qrUrls = signal<Record<string, SafeUrl>>({});

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

  onQRUrl(shortUrl: string, url: SafeUrl): void {
    this.qrUrls.update((map) => ({ ...map, [shortUrl]: url }));
  }

  downloadQR(shortUrl: string): void {
    const url = this.qrUrls()[shortUrl];
    if (url) {
      this.#qrService.download(url, `qr-${shortUrl.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-')}`);
    }
  }
}
