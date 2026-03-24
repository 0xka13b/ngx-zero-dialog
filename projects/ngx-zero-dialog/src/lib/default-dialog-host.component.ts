import { Component } from '@angular/core';

import { DialogContentDirective } from './dialog-content.directive';
import { NgxZeroDialogHost } from './ngx-zero-dialog-host';

/**
 * Built-in default dialog host component.
 * Used automatically when no `hostComponent` is specified in the dialog config.
 * Provides a minimal wrapper with a close button and content insertion point.
 */
@Component({
  standalone: true,
  selector: 'ngx-zero-default-dialog-host',
  imports: [DialogContentDirective],
  template: `
    <div class="ngx-zero-default-host">
      <button
        class="ngx-zero-default-host-close"
        type="button"
        aria-label="Close dialog"
        (click)="close()"
      >&times;</button>
      <div class="ngx-zero-default-host-content">
        <ng-template dialogContent></ng-template>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #fff;
      border-radius: 12px;
      width: 420px;
      max-width: calc(100vw - 32px);
      height: auto;
      max-height: calc(100vh - 64px);
      overflow-y: auto;
    }
    .ngx-zero-default-host {
      position: relative;
      padding: 24px;
    }
    .ngx-zero-default-host-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      padding: 4px 8px;
      color: inherit;
      opacity: 0.6;
    }
    .ngx-zero-default-host-close:hover {
      opacity: 1;
    }
  `],
})
export class DefaultDialogHostComponent extends NgxZeroDialogHost<unknown> {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
