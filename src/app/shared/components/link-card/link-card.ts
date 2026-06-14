import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClipboardService } from '@core/services/clipboard.service';
import { LinkResponse } from '@core/models/link.model';

@Component({
  selector: 'app-link-card',
  imports: [DatePipe],
  templateUrl: './link-card.html',
  styleUrl: './link-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCard {
  readonly link = input.required<LinkResponse>();
  readonly showActions = input(true);

  readonly edit = output<LinkResponse>();
  readonly delete = output<LinkResponse>();

  readonly #clipboard = inject(ClipboardService);
  readonly copiedSignal = this.#clipboard.copied;

  copyShortUrl(shortUrl: string): void {
    this.#clipboard.copy(shortUrl);
  }
}
