import { InjectionToken } from "@angular/core";
import { IDialogData } from "../models/dialog-data.interface";

/**
 * Injection token for dialog content data.
 * Available in the content component/template to access data passed via `dialogData` in the config.
 */
export const DIALOG_DATA = new InjectionToken<IDialogData>('DIALOG_DATA');
