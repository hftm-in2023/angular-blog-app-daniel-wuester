import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Blog } from '../../../shared/models/blog.model';

@Component({
  standalone: true,
  selector: 'app-blog-detail-view',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card *ngIf="blog() as b">
      <mat-card-title>{{ b.title }}</mat-card-title>
      <mat-card-subtitle> von {{ b.author }} am {{ b.createdAt | date }} </mat-card-subtitle>
      <mat-card-content>
        <p>{{ b.content }}</p>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailViewComponent {
  blog = input.required<Blog>();
}
