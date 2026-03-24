import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
  standalone: true,
  selector: 'app-code-snippet',
  templateUrl: 'code-snippet.component.html',
  styleUrl: 'code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Highlight],
})
export class CodeSnippetComponent {
  readonly code = input.required<string>();
  readonly language = input.required<
    'html' | 'javascript' | 'typescript' | 'css'
  >();
  readonly showCopied = signal(false);

  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  copy() {
    navigator.clipboard.writeText(this.code());
    this.showCopied.set(true);

    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }
    this.copyTimer = setTimeout(() => this.showCopied.set(false), 1300);
  }
}
