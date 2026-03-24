import { InjectionToken } from '@angular/core';
import { DialogRef } from '../dialog-ref';

/**
 * Injection token for the dialog reference.
 * Available in both host and content components to control the dialog lifecycle (e.g. closing).
 */
export const DIALOG_REF = new InjectionToken<DialogRef>('DIALOG_REF');
