import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-gray-200 bg-gray-50">
      <div class="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
        &copy; {{ currentYear }} shl &mdash; Acortador de links
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
}
