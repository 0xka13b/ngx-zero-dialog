import { InjectionToken } from "@angular/core";
import { IDialogConfig } from "../models/dialog-config.interface";

/**
 * Injection token for the dialog configuration.
 * Available in host components to access the full dialog config.
 */
export const DIALOG_CONFIG = new InjectionToken<IDialogConfig>('DIALOG_CONFIG');
