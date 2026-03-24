import { Component } from './component.interface';
import { IDialogData } from './dialog-data.interface';
import { IHostData } from './host-data.interface';

/**
 * Configuration options for individual dialogs in the NgxZeroDialog system.
 * These settings control dialog behavior, appearance, and the data passed to dialog components.
 *
 * @export
 * @interface IDialogConfig
 */
export interface IDialogConfig {
  /**
   * Determines whether the dialog should close when the user clicks outside the dialog (on the backdrop).
   * Defaults to `true` if not specified.
   *
   * @type {boolean | undefined}
   * @optional
   */
  closeOnBackdropClick?: boolean;

  /**
   * Determines whether the dialog should close when the user presses the Escape key.
   * Defaults to `true` if not specified.
   *
   * @type {boolean | undefined}
   * @optional
   */
  closeOnEsc?: boolean;

  /**
   * The host component that acts as the container for the dialog content.
   * This component is responsible for rendering the dialog and its layout.
   * If not provided, a built-in default host with a close button is used.
   *
   * @type {Component | undefined}
   * @optional
   */
  hostComponent?: Component;

  /**
   * Data specific to the host component, allowing customization of the host's behavior or appearance.
   * This data is injected into the host component at runtime.
   *
   * @type {IHostData | undefined}
   * @optional
   */
  hostData?: IHostData;

  /**
   * A CSS class or list of classes to be added to the root `<dialog>` element.
   * This can be used to customize the dialog's appearance.
   *
   * @type {string | undefined}
   * @optional
   */
  dialogNodeClass?: string | string[];

  /**
   * Data to be passed to the dialog content component or template.
   * This data is injected into the dynamic content at runtime.
   *
   * @type {IDialogData | undefined}
   * @optional
   */
  dialogData?: IDialogData;

  /**
   * Specifies whether the dialog should use animations for its appearance and disappearance.
   * If not specified, it may default to the global animation setting.
   * Enabled buy default
   *
   * @type {boolean | undefined}
   * @optional
   */
  animated?: boolean;
}
