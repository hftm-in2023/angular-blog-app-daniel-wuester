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
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';
import { CommentService } from '../../shared/services/comment.service';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SpinnerComponent,
    TranslateModule,
  ],
  template: `
    <h2>{{ 'BLOG.OVERVIEW' | translate }}</h2>

    <ng-container *ngIf="blogs$ | async as blogs; else loadingTpl">
      <div class="blog-list" *ngIf="blogs.length > 0; else noBlogs">
        <mat-card class="blog-card" *ngFor="let blog of blogs">
          <mat-card-title>{{ blog.title }}</mat-card-title>
          <mat-card-subtitle>
            {{
              'BLOG.BY'
                | translate
                  : {
                      author: blog.author || 'Unknown',
                      date: (blog.createdAt | date: 'yyyy-MM-dd'),
                    }
            }}
          </mat-card-subtitle>

          <mat-card-content>
            <p>{{ blog.content }}</p>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/blogs', blog.id]">
              {{ 'BLOG.SHOW' | translate }}
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
            <div class="comment-counter" aria-label="Comments">
              <mat-icon>chat_bubble_outline</mat-icon>
              <span class="count" [class.empty]="(commentCount$(blog.id) | async) === 0">
                {{ (commentCount$(blog.id) | async) ?? 0 }}
              </span>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </ng-container>

    <ng-template #loadingTpl>
      <app-spinner></app-spinner>
    </ng-template>

    <ng-template #noBlogs>
      <p>{{ 'BLOG.NO_BLOGS' | translate }}</p>
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
        align-items: center;
        gap: 0.5rem;
      }

      .comment-counter {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.6);
      }

      .comment-counter mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }

      .comment-counter .count.empty {
        opacity: 0.45;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  private oidc = inject(OidcSecurityService);
  private blogService = inject(BlogService);
  private comments = inject(CommentService);

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

  commentCount$(id: number) {
    return this.comments.getCount$(id);
  }
}
