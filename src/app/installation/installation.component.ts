import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';

@Component({
  standalone: true,
  selector: 'app-installation',
  templateUrl: 'installation.component.html',
  styleUrl: 'installation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTabsModule, CodeSnippetComponent],
})
export class InstallationComponent {
  readonly installCode = `
    npm install ngx-zero-dialog
    # or
    yarn add ngx-zero-dialog
  `;

  readonly providerCode = `
    import { provideNgxZeroDialog } from 'ngx-zero-dialog';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideNgxZeroDialog({
          containerNodeID: 'ngx-zero-dialog-container',
        }),
      ],
    };
  `;

  readonly containerCode = `
    <!-- In your root component template (e.g. app.component.html) -->
    <div id="ngx-zero-dialog-container"></div>
  `;

  readonly importStylesCode = `
    /* In your global styles.scss */
    @import "ngx-zero-dialog/styles/ngx-zero-dialog.scss";
  `;
}
