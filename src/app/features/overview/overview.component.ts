import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-overview',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Willkommen in der BlogApp </mat-card-title>
      <mat-card-content>
        <p>
          Dies ist die Übersicht. Wähle links im Menü einen Bereich aus oder starte direkt mit den
          Blogs.
        </p>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {}
