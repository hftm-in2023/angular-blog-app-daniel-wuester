import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog } from '../../../shared/models/blog.schema';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-blog-detail-view',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card *ngIf="blog">
      <mat-card-title>{{ blog.title }}</mat-card-title>
      <mat-card-subtitle>
        von {{ blog.author }} am {{ blog.createdAt | date }}
      </mat-card-subtitle>
      <mat-card-content>
        <p>{{ blog.content }}</p>
      </mat-card-content>
    </mat-card>
  `
})
export class BlogDetailViewComponent {
  @Input() blog!: Blog;
}
