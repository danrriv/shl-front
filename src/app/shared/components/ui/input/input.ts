import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  imports: [FormsModule],
  template: `
    <input
      [type]="type()"
      [placeholder]="placeholder()"
      [attr.aria-label]="ariaLabel()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      (keydown.enter)="enterPress.emit()"
      class="w-full rounded-xl border border-paper-300 px-4 py-3 text-paper-900 placeholder:text-paper-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  readonly type = input('text');
  readonly placeholder = input('');
  readonly ariaLabel = input('');
  readonly value = model('');
  readonly enterPress = output();
}
