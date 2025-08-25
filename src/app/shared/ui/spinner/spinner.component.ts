import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<div class="spinner-wrap">
    <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
  </div>`,
  styles: [
    `
      .spinner-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
