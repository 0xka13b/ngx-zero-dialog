import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';

@Component({
  standalone: true,
  selector: 'app-custom-animation',
  templateUrl: 'custom-animation.component.html',
  styleUrl: 'custom-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeSnippetComponent],
})
export class CustomAnimationComponent {
  readonly defaultAnimationCode = `
    dialog.ngx-zero-dialog-hidden {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;

      &::backdrop {
        opacity: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(5px);
        transition: opacity 0.2s ease-in-out;
      }
    }

    dialog.ngx-zero-dialog-visible {
      opacity: 1;
      transition: opacity 0.2s ease-in-out;

      &::backdrop {
        opacity: 1;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(5px);
        transition: opacity 0.2s ease-in-out;
      }
    }
  `;

  readonly customAnimation = `
    /* Add to your global styles.scss to override the default animation */
    dialog.ngx-zero-dialog-hidden {
      transform: translateY(1000px);
    }

    dialog.ngx-zero-dialog-visible {
      transform: unset;

      /* Backdrop styles are customizable too */
      &::backdrop {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  `;
}
