import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackBar = inject(MatSnackBar); // 🔄 Standalone DI

  handleError(error: any): void {
    console.error('Globaler Fehler:', error);

    const message = error?.message || 'Ein unbekannter Fehler ist aufgetreten.';
    this.snackBar.open(`Fehler: ${message}`, 'Schließen', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
}
