import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  TemplateRef,
} from '@angular/core';
import { defer, finalize, Observable, take } from 'rxjs';

import { DialogRef } from './dialog-ref';
import { Component } from './models/component.interface';
import { IDialogConfig } from './models/dialog-config.interface';
import { IDialogData } from './models/dialog-data.interface';
import { DialogResult } from './models/dialog-result.type';
import { IHostData } from './models/host-data.interface';
import { INgxZeroDialogConfig } from './models/ngx-zero-dialog-config.interface';
import { WithRequiredProperties } from './models/with-required-properties.type';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_DATA } from './providers/dialog-data.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { HOST_DATA } from './providers/host-data.token';
import { NGX_ZERO_DIALOG_CONFIG } from './providers/provide-ngx-zero-dialog';

/**
 * NgxZeroDialogService managing dialog creation, configuration, and lifecycle in Angular.
 * It supports opening dialogs with components or templates, injecting dependencies,
 * and handling cleanup after dialog closure.
 *
 * @export
 * @class NgxZeroDialogService
 */
@Injectable({ providedIn: 'root' })
export class NgxZeroDialogService {
  private dialogCounter = 0;

  private readonly ngxZeroDialogConfig = inject<INgxZeroDialogConfig>(
    NGX_ZERO_DIALOG_CONFIG
  );

  private readonly parentInjector = inject(Injector);

  private readonly appRef = inject(ApplicationRef);

  private readonly document = inject(DOCUMENT);

  /**
   * Opens a dialog with the specified template or component.
   * The dialog configuration allows customization of behavior, data, and animations.
   *
   * @template Result The type of result the dialog will return.
   * @param {Component | TemplateRef<any>} templateOrComponent The component or template to render in the dialog.
   * @param {IDialogConfig} [config] Optional dialog configuration.
   * @returns {Observable<DialogResult<Result>>} Observable emitting the result of the dialog on closure.
   */
  openDialog<Result>(
    templateOrComponent: Component | TemplateRef<any>,
    config?: IDialogConfig
  ): Observable<DialogResult<Result>> {
    return defer(() => {
      if (!config?.hostComponent) {
        throw new Error(
          'NgxZeroDialog: `hostComponent` is required in dialog config. ' +
            'Provide a component that extends NgxZeroDialogHost.'
        );
      }

      const normalizedConfig = this.normalizeConfig(config);

      const dialogRef = this.createDialogRef<Result>(normalizedConfig);

      const dialogInjector = this.createDialogInjector(
        this.parentInjector,
        <DialogRef<unknown>>dialogRef,
        normalizedConfig.dialogData
      );

      const hostInjector = this.createHostInjector(
        this.parentInjector,
        normalizedConfig.hostData,
        normalizedConfig,
        <DialogRef<unknown>>dialogRef
      );

      const hostComponentRef = createComponent<any>(
        normalizedConfig.hostComponent,
        {
          environmentInjector: this.appRef.injector,
          elementInjector: hostInjector,
        }
      );

      this.appRef.attachView(hostComponentRef.hostView);

      const containerNode = this.document.getElementById(
        this.ngxZeroDialogConfig.containerNodeID
      );

      if (!containerNode) {
        throw new Error(
          `NgxZeroDialog: container element with id "${this.ngxZeroDialogConfig.containerNodeID}" ` +
            'was not found in the DOM. Add <div id="' +
            this.ngxZeroDialogConfig.containerNodeID +
            '"></div> to your index.html or root component template.'
        );
      }

      containerNode.appendChild(dialogRef.nativeDialog);

      dialogRef.nativeDialog.appendChild(
        this.getComponentRootNode(hostComponentRef)
      );

      let viewRef: EmbeddedViewRef<any>;

      if (templateOrComponent instanceof TemplateRef) {
        viewRef =
          hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(
            templateOrComponent,
            {
              $implicit: dialogRef,
              data: normalizedConfig.dialogData,
              injector: dialogInjector,
            }
          );
      } else {
        viewRef =
          hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
            templateOrComponent,
            { injector: dialogInjector }
          );
      }

      dialogRef.nativeDialog.showModal();

      if (normalizedConfig.animated) {
        dialogRef.nativeDialog.classList.add('ngx-zero-dialog-visible');
      }

      return dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.cleanupDialog(
            dialogRef.nativeDialog.id,
            hostComponentRef,
            viewRef
          );
        })
      );
    });
  }

  /**
   * Creates a new dialog reference, including DOM element creation and configuration.
   *
   * @template Result The type of result the dialog will return.
   * @param {IDialogConfig} config The configuration for the dialog.
   * @returns {DialogRef<Result>} The dialog reference object.
   */
  private createDialogRef<Result>(config: IDialogConfig): DialogRef<Result> {
    const newDialog = document.createElement('dialog');
    const dialogID = `ngx-zero-dialog-${++this.dialogCounter}`;

    newDialog.setAttribute('aria-modal', 'true');
    newDialog.setAttribute('role', 'dialog');
    newDialog.setAttribute('id', dialogID);

    newDialog.classList.add('ngx-zero-dialog');

    if (config.dialogNodeClass) {
      newDialog.classList.add(config.dialogNodeClass);
    }

    if (config.animated) {
      newDialog.classList.add('ngx-zero-dialog-hidden');
    } else {
      newDialog.classList.add('ngx-zero-dialog-visible');
    }

    const dialogRef = new DialogRef<Result>(newDialog, config.animated);

    return dialogRef;
  }

  /**
   * Cleans up the dialog after it is closed, including removing it from the DOM and destroying views.
   *
   * @param {string} dialogID The ID of the dialog element to remove.
   * @param {ComponentRef<any>} dialogHostRef The reference to the host component.
   * @param {EmbeddedViewRef<any>} viewRef The reference to the embedded view.
   */
  private cleanupDialog(
    dialogID: string,
    dialogHostRef: ComponentRef<any>,
    viewRef: EmbeddedViewRef<any>
  ) {
    viewRef.destroy();

    dialogHostRef.hostView.destroy();
    dialogHostRef.destroy();

    this.document
      .getElementById(this.ngxZeroDialogConfig.containerNodeID)
      ?.removeChild(this.document.getElementById(dialogID)!);
  }

  /**
   * Retrieves the root DOM node of a dynamically created component.
   *
   * @param {ComponentRef<any>} componentRef The reference to the dynamically created component.
   * @returns {HTMLElement} The root DOM node of the component.
   */
  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  /**
   * Normalizes the dialog configuration by merging defaults with provided options.
   *
   * @param {IDialogConfig} [config] The provided dialog configuration.
   * @returns {WithRequiredProperties<IDialogConfig>} The normalized dialog configuration.
   */
  private normalizeConfig(
    config?: IDialogConfig
  ): WithRequiredProperties<IDialogConfig> {
    return {
      closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
      dialogData: config?.dialogData ?? {},
      hostComponent: config?.hostComponent,
      animated:
        this.ngxZeroDialogConfig.enableAnimations ?? config?.animated ?? true,
      hostData: config?.hostData ?? {},
    } as WithRequiredProperties<IDialogConfig>;
  }

  /**
   * Creates a custom injector for injecting dialog-specific dependencies into the dialog component or template.
   *
   * @param {Injector} parentInjector The parent injector.
   * @param {DialogRef} dialogRef The dialog reference.
   * @param {IDialogData} data The data to inject into the dialog.
   * @returns {Injector} The created custom injector.
   */
  private createDialogInjector(
    parentInjector: Injector,
    dialogRef: DialogRef,
    data: IDialogData
  ): Injector {
    return Injector.create({
      parent: parentInjector,
      providers: [
        {
          provide: DIALOG_REF,
          useValue: dialogRef,
        },
        {
          provide: DIALOG_DATA,
          useValue: data,
        },
      ],
    });
  }

  /**
   * Creates a custom injector for injecting host-specific dependencies into the host component.
   *
   * @param {Injector} parentInjector The parent injector.
   * @param {IHostData} hostData The data specific to the host component.
   * @param {IDialogConfig} dialogConfig The dialog configuration.
   * @param {DialogRef} dialogRef The dialog reference.
   * @returns {Injector} The created custom injector.
   */
  private createHostInjector(
    parentInjector: Injector,
    hostData: IHostData,
    dialogConfig: IDialogConfig,
    dialogRef: DialogRef
  ): Injector {
    return Injector.create({
      parent: parentInjector,
      providers: [
        {
          provide: HOST_DATA,
          useValue: hostData,
        },
        {
          provide: DIALOG_CONFIG,
          useValue: dialogConfig,
        },
        {
          provide: DIALOG_REF,
          useValue: dialogRef,
        },
      ],
    });
  }
}
