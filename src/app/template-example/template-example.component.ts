import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxZeroDialogService } from 'ngx-zero-dialog';

import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';
import { ShowCodeBtnComponent } from '../components/show-code-btn/show-code-btn.component';
import { DialogHostComponent } from './dialog-host/dialog-host.component';

@Component({
  standalone: true,
  selector: 'app-template-example',
  templateUrl: 'template-example.component.html',
  styleUrl: 'template-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowCodeBtnComponent,
    MatTabsModule,
    CodeSnippetComponent,
  ],
})
export class TemplateExampleComponent {
  private readonly dialog = inject(NgxZeroDialogService);

  readonly countryCtrl = new FormControl('');

  readonly mode = signal<'code' | 'demo'>('demo');

  readonly htmlCode = `
    <!-- The template gets dialogRef and data as context variables -->
    <ng-template #dialogTemplate let-dialogRef let-data="data">
      <div class="dialog-body">
        Your country is <strong>{{ data.country || 'Unknown' }}</strong>
        <button (click)="dialogRef.close()">Got it</button>
      </div>
    </ng-template>
  `;

  readonly tsCode = `
    import { NgxZeroDialogService } from 'ngx-zero-dialog';

    @Component({ ... })
    export class TemplateExampleComponent {
      private readonly dialog = inject(NgxZeroDialogService);

      readonly countryCtrl = new FormControl('');

      openDialog(templateRef: TemplateRef<unknown>) {
        this.dialog
          .openDialog(templateRef, {
            hostComponent: DialogHostComponent,
            hostData: {
              title: 'Template-based dialog',
              closable: false,  // hides the close button in host
            },
            dialogData: {
              country: this.countryCtrl.value,
            },
          })
          .subscribe();
      }
    }
  `;

  readonly dialogHostCode = `
    import { DialogContentDirective, NgxZeroDialogHost } from 'ngx-zero-dialog';

    interface DialogHostData {
      title: string;
      closable?: boolean;
    }

    @Component({
      standalone: true,
      selector: 'app-dialog-host',
      template: \`
        <div class="title">{{ hostData.title }}</div>
        @if (hostData.closable !== false) {
          <button class="close" (click)="close()">&times;</button>
        }
        <div class="content">
          <ng-template dialogContent></ng-template>
        </div>
      \`,
      imports: [DialogContentDirective],
    })
    export class DialogHostComponent extends NgxZeroDialogHost<DialogHostData> {
      constructor() { super(); }

      close() { this.dialogRef.close(); }
    }
  `;

  openTemplateBasedDialog(templateRef: TemplateRef<unknown>) {
    this.dialog
      .openDialog(templateRef, {
        hostComponent: DialogHostComponent,
        hostData: {
          title: 'Template-based dialog',
          closable: false,
        },
        dialogData: {
          country: this.countryCtrl.value,
        },
      })
      .subscribe();
  }

  toggleCode() {
    this.mode.set(this.mode() === 'code' ? 'demo' : 'code');
  }
}
