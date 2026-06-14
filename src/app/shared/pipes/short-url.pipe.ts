import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortUrl' })
export class ShortUrlPipe implements PipeTransform {
  transform(value: string, maxLength: number = 30): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    try {
      const url = new URL(value);
      return `${url.host}${url.pathname.length > (maxLength - url.host.length - 3) ? url.pathname.substring(0, maxLength - url.host.length - 3) + '...' : url.pathname}`;
    } catch {
      return value.substring(0, maxLength - 3) + '...';
    }
  }
}
