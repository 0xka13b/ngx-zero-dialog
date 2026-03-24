import { Subject } from 'rxjs';
import { DialogResult } from './models/dialog-result.type';

/**
 * A reference to a dialog, providing methods to control its lifecycle and observe its closure.
 *
 * @export
 * @class DialogRef
 * @template Result The type of the result returned by the dialog when it is closed.
 */
export class DialogRef<Result = unknown> {
  /**
   * Subject that emits the result of the dialog when it is closed.
   * @private
   */
  readonly #_closed$ = new Subject<DialogResult<Result>>();

  /**
   * Observable that emits the result of the dialog when it is closed.
   * Consumers can subscribe to this observable to react to dialog closure.
   *
   * @readonly
   * @type {Observable<DialogResult<Result>>}
   */
  readonly closed$ = this.#_closed$.asObservable();

  constructor(
    readonly nativeDialog: HTMLDialogElement,
    readonly animated?: boolean
  ) {}

  /**
   * Closes the dialog and optionally emits a result.
   * If animations are enabled, the dialog waits for the transition to complete before fully closing.
   *
   * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
   */
  close(value?: DialogResult<Result>) {
    if (this.animated) {
      this.#terminateAnimatedDialog(value);
    } else {
      this.#terminateDialog(value);
    }
  }

  /**
   * Handles the termination of the dialog with animations.
   * It waits for the transition to complete before closing the dialog and emitting the result.
   *
   * @private
   * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
   */
  #terminateAnimatedDialog(value?: DialogResult<Result>) {
    if (this.animated) {
      let terminated = false;

      const terminate = () => {
        if (terminated) return;
        terminated = true;
        clearTimeout(fallbackTimer);
        this.#terminateDialog(value);
      };

      this.nativeDialog.classList.remove('ngx-zero-dialog-visible');
      this.nativeDialog.addEventListener('transitionend', terminate, {
        once: true,
      });

      // Safety fallback: if transitionend never fires (e.g. prefers-reduced-motion,
      // no transition property, tab backgrounded), close after a reasonable timeout.
      const fallbackTimer = setTimeout(terminate, 300);
    } else {
      this.#terminateDialog(value);
    }
  }

  /**
   * Handles the termination of the dialog, closing the native dialog element
   * and emitting the result through the `closed$` observable.
   *
   * @private
   * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
   */
  #terminateDialog(value?: DialogResult<Result>) {
    this.nativeDialog.close();
    this.#_closed$.next(value);
  }
}
