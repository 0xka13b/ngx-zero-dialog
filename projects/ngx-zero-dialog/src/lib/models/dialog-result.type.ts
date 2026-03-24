/**
 * The result type emitted when a dialog closes.
 * `undefined` is emitted when the dialog is closed without providing a value.
 *
 * @template R The expected result type.
 */
export type DialogResult<R = unknown> = R | undefined;
