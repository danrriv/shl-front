import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class QRService {
  download(dataUrl: SafeUrl, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = dataUrl.toString();
    anchor.download = `${filename}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
