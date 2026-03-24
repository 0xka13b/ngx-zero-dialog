import { Component } from '@angular/core';
import { DialogContentDirective, NgxZeroDialogHost } from 'ngx-zero-dialog';

interface DialogHostData {
  title: string;
  closable?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-dialog-host',
  templateUrl: 'dialog-host.component.html',
  styleUrl: 'dialog-host.component.scss',
  imports: [DialogContentDirective],
})
export class DialogHostComponent extends NgxZeroDialogHost<DialogHostData> {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
