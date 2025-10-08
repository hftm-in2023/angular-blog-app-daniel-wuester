import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { inject, signal, computed } from '@angular/core';

import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink, MatIconModule],
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
        <mat-card-actions class="actions">
          <button
            mat-icon-button
            color="warn"
            *ngIf="isAuthenticated"
            (click)="toggleLike(blog.id)"
          >
            <mat-icon>{{ isLiked(blog.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>

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
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        margin-top: 16px;
        align-items: start;
      }

      .blog-card,
      mat-card.blog-card {
        width: 100%;
        display: block;
      }

      .blog-card mat-card-content p {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      button[mat-icon-button] {
        transition: transform 0.2s ease;
      }

      button[mat-icon-button]:active {
        transform: scale(1.2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  private readonly oidc = inject(OidcSecurityService);
  private readonly blogService = inject(BlogService);
  blogs$: Observable<Blog[]> = this.blogService.getBlogs();

  private _isAuthenticated = signal(false);
  isAuthenticated = computed(() => this._isAuthenticated());

  constructor() {
    this.oidc.isAuthenticated$.subscribe((res) => {
      this._isAuthenticated.set(!!res?.isAuthenticated);
    });
  }

  toggleLike(id: number) {
    this.blogService.toggleLike(id);
  }

  isLiked(id: number): boolean {
    return this.blogService.isLiked(id);
  }
}
