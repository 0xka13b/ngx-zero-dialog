import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxZeroDialogService } from 'ngx-zero-dialog';

import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';
import { ShowCodeBtnComponent } from '../components/show-code-btn/show-code-btn.component';
import { DialogHostComponent } from './dialog-host/dialog-host.component';
import {
  ComponentDialogResult,
  DialogComponent,
} from './dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-component-example',
  templateUrl: 'component-example.component.html',
  styleUrl: 'component-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    ShowCodeBtnComponent,
    CodeSnippetComponent,
  ],
})
export class ComponentExampleComponent {
  private readonly dialog = inject(NgxZeroDialogService);

  readonly nameCtrl = new FormControl('');

  readonly mode = signal<'demo' | 'code'>('demo');

  readonly result = signal<ComponentDialogResult | undefined>(undefined);

  readonly tsCode = `
    import { NgxZeroDialogService, DIALOG_DATA, DIALOG_REF } from 'ngx-zero-dialog';

    @Component({ ... })
    export class MyComponent {
      private readonly dialog = inject(NgxZeroDialogService);

      readonly nameCtrl = new FormControl('');

      openDialog() {
        this.dialog
          .openDialog<string>(DialogComponent, {
            hostComponent: AppDialogHostComponent,
            hostData: { title: 'Component-based dialog' },
            dialogData: { name: this.nameCtrl.value },
          })
          .subscribe((result) => console.log('Result:', result));
      }
    }
  `;

  readonly dialogCode = `
    export interface ComponentDialogData { name: string; }

    @Component({
      standalone: true,
      selector: 'app-dialog',
      template: \`
        <div class="greetings">Hello, {{ data.name }}</div>
        <input type="text" placeholder="How old are you?"
               (input)="setResult($event)" />
        <button (click)="close()">Submit</button>
      \`,
    })
    export class DialogComponent {
      readonly data = inject<ComponentDialogData>(DIALOG_DATA);
      private readonly dialogRef = inject(DIALOG_REF);
      private readonly result = signal('');

      setResult(event: Event) {
        this.result.set((event.target as HTMLInputElement).value);
      }

      close() {
        this.dialogRef.close(this.result());
      }
    }
  `;

  readonly dialogHostCode = `
    import { DialogContentDirective, NgxZeroDialogHost } from 'ngx-zero-dialog';

    interface AppDialogHostData { title: string; }

    @Component({
      standalone: true,
      selector: 'app-dialog-host',
      template: \`
        <div class="title">{{ hostData.title }}</div>
        <button class="close" (click)="close()">&times;</button>
        <div class="content">
          <ng-template dialogContent></ng-template>
        </div>
      \`,
      imports: [DialogContentDirective],
    })
    export class AppDialogHostComponent extends NgxZeroDialogHost<AppDialogHostData> {
      constructor() { super(); }

      close() { this.dialogRef.close(); }
    }
  `;

  openComponentBasedDialog() {
    this.dialog
      .openDialog<ComponentDialogResult>(DialogComponent, {
        hostComponent: DialogHostComponent,
        hostData: {
          title: 'Component-based dialog',
        },
        dialogData: {
          name: this.nameCtrl.value,
        },
      })
      .subscribe((result) => this.result.set(result));
  }

  toggleCode() {
    this.mode.set(this.mode() === 'code' ? 'demo' : 'code');
  }
}
