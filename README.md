# ngx-zero-dialog

A lightweight, zero-dependency Angular library for managing dialogs using the native HTML `<dialog>` API. Accessible, customizable, and fully driven by CSS animations.

> Requires Angular 16 or newer

[Live Demo](0xka13b.github.io/ngx-zero-dialog/)

## Quick Start

Install the library:

```bash
npm install ngx-zero-dialog
# or
yarn add ngx-zero-dialog
```

Add a dialog container to your root component template (e.g. `app.component.html`):

```html
<div id="ngx-zero-dialog-container"></div>
```

Provide the configuration in your app config:

```typescript
import { provideNgxZeroDialog } from 'ngx-zero-dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxZeroDialog({ containerNodeID: 'ngx-zero-dialog-container' }),
  ],
};
```

Import the library styles in your global stylesheet:

```scss
@import "ngx-zero-dialog/styles/ngx-zero-dialog.scss";
```

Open a dialog:

```typescript
import { NgxZeroDialogService } from 'ngx-zero-dialog';

@Component({ ... })
export class MyComponent {
  private readonly dialog = inject(NgxZeroDialogService);

  open(template: TemplateRef<unknown>) {
    this.dialog.openDialog(template).subscribe((result) => {
      console.log('Dialog closed with:', result);
    });
  }
}
```

```html
<button (click)="open(myDialog)">Open</button>

<ng-template #myDialog let-dialogRef>
  <p>Hello from a dialog!</p>
  <button (click)="dialogRef.close('done')">Close</button>
</ng-template>
```

That's it — no custom host component needed. A built-in default host with a close button is used automatically.

> **NgModule setup**: If you're not using standalone APIs, add `provideNgxZeroDialog(...)` to your module's `providers` array instead.

---

## Core Concepts

### Three-Element Dialog Structure

Each dialog consists of three elements:

1. **Native `<dialog>` element** — created automatically, provides browser-level modal behavior (focus trapping, backdrop, stacking context)
2. **Host component** — the dialog's frame/chrome (title bar, close button, layout). A built-in default is provided, or you can create your own.
3. **Content** — your actual dialog body, passed as a `Component` or `TemplateRef`

### Stacking Context

HTML dialogs exist in their own top-layer, ensuring that dialogs and their child views never intersect regardless of z-index or how nodes are positioned. No overlay system or CDK is needed.

### Observable-Based API

`openDialog()` returns a cold `Observable` — the dialog is only created when subscribed to. The observable emits a single result value when the dialog closes, then completes.

---

## API Reference

### `NgxZeroDialogService`

The main service. Has one public method:

```typescript
openDialog<Result>(
  componentOrTemplate: Component | TemplateRef<any>,
  config?: IDialogConfig,
): Observable<DialogResult<Result>>
```

### `IDialogConfig`

All fields are optional:

```typescript
interface IDialogConfig {
  /** Close when clicking outside the dialog. Default: true */
  closeOnBackdropClick?: boolean;

  /** Close when pressing Escape. Default: true */
  closeOnEsc?: boolean;

  /**
   * Host component wrapping the dialog content.
   * If omitted, a built-in DefaultDialogHostComponent is used.
   */
  hostComponent?: Component;

  /** Data injected into the host component via HOST_DATA token */
  hostData?: IHostData;

  /** CSS class(es) added to the native <dialog> element */
  dialogNodeClass?: string | string[];

  /** Data injected into the content via DIALOG_DATA token */
  dialogData?: IDialogData;

  /** Enable open/close CSS transitions. Default: true */
  animated?: boolean;
}
```

### `DialogRef<Result>`

A reference to an open dialog, available in both host and content components via the `DIALOG_REF` token.

```typescript
class DialogRef<Result = unknown> {
  /** The underlying native <dialog> element */
  readonly nativeDialog: HTMLDialogElement;

  /** Observable that emits the result when the dialog closes */
  readonly closed$: Observable<DialogResult<Result>>;

  /** Close the dialog, optionally emitting a result value */
  close(value?: DialogResult<Result>): void;

  /**
   * Register a guard that is called before close.
   * Return false (or Observable<false> / Promise<false>) to prevent closing.
   */
  beforeClose(guard: BeforeCloseGuard<Result>): void;
}
```

`DialogResult<Result>` is `Result | undefined` — `undefined` is emitted when the dialog closes without a value.

### `BeforeCloseGuard`

```typescript
type BeforeCloseGuard<Result> = (
  value?: DialogResult<Result>
) => boolean | Observable<boolean> | Promise<boolean>;
```

Example — confirm before closing:

```typescript
@Component({ ... })
export class MyDialog {
  private readonly dialogRef = inject<DialogRef<string>>(DIALOG_REF);

  constructor() {
    this.dialogRef.beforeClose(() => confirm('Discard changes?'));
  }
}
```

### Injection Tokens

| Token | Available in | Value |
|-------|-------------|-------|
| `DIALOG_REF` | Host + Content | `DialogRef` instance |
| `DIALOG_DATA` | Content | The `dialogData` object from config |
| `DIALOG_CONFIG` | Host | The full `IDialogConfig` |
| `HOST_DATA` | Host | The `hostData` object from config |

---

## Default Host vs. Custom Host

### Default Host

When you omit `hostComponent` from the config, a built-in `DefaultDialogHostComponent` is used. It provides a minimal wrapper with a close button. Good for simple use cases.

### Custom Host

For a consistent dialog frame across your app (title bar, footer, custom styling), create your own host:

1. Extend `NgxZeroDialogHost<T>` where `T` is the type of your `hostData`
2. Import `DialogContentDirective` and place `<ng-template dialogContent></ng-template>` in your template
3. Call `super()` in the constructor

```typescript
interface MyHostData {
  title: string;
}

@Component({
  standalone: true,
  selector: 'app-dialog-host',
  imports: [DialogContentDirective],
  template: `
    <div class="header">
      <h2>{{ hostData.title }}</h2>
      <button (click)="close()">&times;</button>
    </div>
    <div class="body">
      <ng-template dialogContent></ng-template>
    </div>
  `,
})
export class AppDialogHostComponent extends NgxZeroDialogHost<MyHostData> {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
```

Use it:

```typescript
this.dialog.openDialog(MyContentComponent, {
  hostComponent: AppDialogHostComponent,
  hostData: { title: 'Settings' },
}).subscribe();
```

`NgxZeroDialogHost` automatically injects `dialogRef`, `dialogConfig`, and `hostData` for you. It also handles backdrop-click and Escape key behavior based on the config.

---

## Animations

ngx-zero-dialog uses CSS class toggling for enter/leave animations. Two classes are applied to the `<dialog>` element:

- `ngx-zero-dialog-hidden` — applied on creation (before open transition)
- `ngx-zero-dialog-visible` — added after `showModal()` (triggers open), removed on close (triggers close)

The built-in styles provide a simple opacity fade:

```scss
dialog.ngx-zero-dialog-hidden {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &::backdrop {
    opacity: 0;
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
```

Override these in your global styles for custom animations (e.g. slide-in):

```scss
dialog.ngx-zero-dialog-hidden {
  transform: translateY(100vh);
}

dialog.ngx-zero-dialog-visible {
  transform: translateY(0);
}
```

Disable animations globally via `provideNgxZeroDialog({ ..., enableAnimations: false })` or per-dialog with `animated: false` in the config.

---

## Global Configuration

```typescript
interface INgxZeroDialogConfig {
  /** ID of the container element where dialogs are appended. Required. */
  containerNodeID: string;

  /** Globally enable/disable animations. Default: true */
  enableAnimations?: boolean;
}
```

---

## License

MIT

## Contributing

Feel free to open discussions, raise issues, or submit pull requests on [GitHub](https://github.com/ko1ebayev/ngx-zero-dialog).
