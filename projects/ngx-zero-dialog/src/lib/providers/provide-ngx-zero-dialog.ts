import { InjectionToken, Provider } from '@angular/core';
import { INgxZeroDialogConfig } from '../models/ngx-zero-dialog-config.interface';

/** @internal Injection token for the global ngx-zero-dialog configuration. */
export const NGX_ZERO_DIALOG_CONFIG = new InjectionToken<INgxZeroDialogConfig>(
  'NGX_ZERO_DIALOG_CONFIG'
);

/**
 * Provides the global ngx-zero-dialog configuration.
 * Call this in your application's providers array.
 *
 * @param config Global configuration specifying the container element ID and animation settings.
 * @returns An Angular provider for the library configuration.
 *
 * @example
 * ```typescript
 * provideNgxZeroDialog({ containerNodeID: 'ngx-zero-dialog-container' })
 * ```
 */
export const provideNgxZeroDialog = (
  config: INgxZeroDialogConfig
): Provider => {
  return {
    provide: NGX_ZERO_DIALOG_CONFIG,
    useValue: config,
  };
};
