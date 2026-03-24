import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxZeroDialogService } from 'ngx-zero-dialog';

import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';
import { ShowCodeBtnComponent } from '../components/show-code-btn/show-code-btn.component';

@Component({
  standalone: true,
  selector: 'app-simple-example',
  templateUrl: 'simple-example.component.html',
  styleUrl: 'simple-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabsModule, ShowCodeBtnComponent, CodeSnippetComponent],
})
export class SimpleExampleComponent {
  private readonly dialog = inject(NgxZeroDialogService);

  readonly mode = signal<'demo' | 'code'>('demo');

  readonly result = signal<string | undefined>(undefined);

  readonly htmlCode = `
    <button (click)="openDialog(myDialog)">Open dialog</button>

    <ng-template #myDialog let-dialogRef>
      <div style="padding: 24px; text-align: center;">
        <h3>Hello!</h3>
        <p>This dialog uses the built-in default host.</p>
        <p>No custom host component needed.</p>
        <button (click)="dialogRef.close('confirmed')">
          Confirm
        </button>
      </div>
    </ng-template>
  `;

  readonly tsCode = `
    @Component({ ... })
    export class SimpleExampleComponent {
      private readonly dialog = inject(NgxZeroDialogService);

      openDialog(template: TemplateRef<unknown>) {
        this.dialog
          .openDialog<string>(template)
          .subscribe((result) => {
            console.log('Dialog closed with:', result);
          });
      }
    }
  `;

  openDialog(template: TemplateRef<unknown>) {
    this.dialog
      .openDialog<string>(template)
      .subscribe((result) => this.result.set(result));
  }

  toggleCode() {
    this.mode.set(this.mode() === 'code' ? 'demo' : 'code');
  }
}
