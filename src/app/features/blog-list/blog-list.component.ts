import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
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

          <button
            *ngIf="isAuth()"
            mat-icon-button
            aria-label="Like"
            (click)="toggleLike(blog); $event.stopPropagation()"
            [disabled]="liking()"
          >
            <mat-icon>{{ (isLiked$(blog) | async) ? 'favorite' : 'favorite_border' }}</mat-icon>
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
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .blog-card {
        display: flex;
        flex-direction: column;
      }
      mat-card-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  private oidc = inject(OidcSecurityService);
  private blogService = inject(BlogService);

  blogs$: Observable<Blog[]> = this.blogService.getBlogs();

  private _isAuth = signal(false);
  isAuth = () => this._isAuth();
  private _liking = signal(false);
  liking = () => this._liking();

  private likedIds = new Set<number>();
  isLiked = (b: Blog) => this.likedIds.has(b.id!);

  constructor() {
    this.oidc.isAuthenticated$.subscribe((res: any) => {
      this._isAuth.set(!!res?.isAuthenticated);
    });
  }
  isLiked$ = (blog: Blog) => this.blogService.isLiked$(blog.id);

  toggleLike(blog: Blog) {
    this._liking.set(true);
    try {
      this.blogService.toggleLike(blog.id);
    } finally {
      this._liking.set(false);
    }
  }
}
