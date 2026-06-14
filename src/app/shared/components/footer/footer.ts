import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-paper-200 bg-paper-50">
      <div class="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-paper-500">
        &copy; {{ currentYear }} Yavoy.pe &mdash; Acortador de links y más
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
}
