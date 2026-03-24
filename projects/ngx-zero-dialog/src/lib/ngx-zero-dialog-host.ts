import { Directive, inject, ViewChild } from '@angular/core';

import { DialogContentDirective } from './dialog-content.directive';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { HOST_DATA } from './providers/host-data.token';

/**
 * A base class for creating custom dialog host components in Angular.
 * Provides utilities for managing dialog behavior, injecting dialog-specific dependencies,
 * and enabling custom dialog content insertion.
 *
 * @export
 * @class NgxZeroDialogHost
 * @template HostData The type of the data provided to the host component.
 */
@Directive()
export class NgxZeroDialogHost<HostData> {
  /**
   * The insertion point for dynamic content within the dialog.
   * This is linked to the `DialogContentDirective` and is used for rendering
   * content such as templates or components into the dialog.
   *
   * @type {DialogContentDirective}
   */
  @ViewChild(DialogContentDirective, { static: true })
  contentInsertionPoint!: DialogContentDirective;

  /**
   * A reference to the dialog, providing methods for controlling its lifecycle,
   * such as closing the dialog.
   *
   * @readonly
   * @type {DialogRef}
   */
  readonly dialogRef = inject(DIALOG_REF);

  /**
   * The configuration object for the dialog, specifying properties such as
   * animations, backdrop behavior, and dialog-specific settings.
   *
   * @readonly
   * @type {IDialogConfig}
   */
  readonly dialogConfig = inject(DIALOG_CONFIG);

  /**
   * The data specific to the host component, allowing customization of the host behavior
   * based on this data.
   *
   * @readonly
   * @type {HostData}
   */
  readonly hostData = inject<HostData>(HOST_DATA);

  constructor() {
    this.#closeOnEsc();
    if (this.dialogConfig.closeOnBackdropClick) {
      this.#closeOnBackdropClick();
    }
  }

  /**
   * Closes the dialog when the user clicks outside its bounds (on the backdrop),
   * if the `closeOnBackdropClick` configuration is enabled.
   *
   * @private
   */
  #closeOnBackdropClick() {
    this.dialogRef.nativeDialog.addEventListener('click', (event) => {
      const rect = this.dialogRef.nativeDialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        this.dialogRef.close();
      }
    });
  }

  #closeOnEsc() {
    this.dialogRef.nativeDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.dialogRef.close();
    });
  }
}
