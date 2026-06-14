import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  readonly copied = signal<string | null>(null);

  async copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(text);
      setTimeout(() => this.copied.set(null), 2000);
      return true;
    } catch {
      return false;
    }
  }
}
