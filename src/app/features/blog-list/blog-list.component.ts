import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  template: `
    <h2>Blogübersicht</h2>

    <div class="blog-list" *ngIf="blogs$ | async as blogs; else noBlogs">
      <mat-card class="blog-card" *ngFor="let blog of blogs">
        <mat-card-title>{{ blog.title }}</mat-card-title>
        <mat-card-subtitle>
          von {{ blog.author || 'Unknown' }} am
          {{ blog.createdAt ? (blog.createdAt | date: 'yyyy-MM-dd') : '-' }}
        </mat-card-subtitle>

        <mat-card-content>
          <p>{{ blog.content }}</p>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" [routerLink]="['/blogs', blog.id]">
            Anzeigen
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <ng-template #noBlogs>
      <p>Keine Blogs verfügbar.</p>
    </ng-template>
  `,
  styles: [
    `
      .blog-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
      }
      .blog-card {
        flex: 1 1 calc(50% - 1rem);
        min-width: 300px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  blogs$: Observable<Blog[]>;

  constructor(private readonly blogService: BlogService) {
    this.blogs$ = this.blogService.getBlogs();
  }
}
