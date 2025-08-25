import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BlogStore } from '../../state/blog.store';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    SpinnerComponent,
  ],

  template: `
    <h2>Blogübersicht</h2>

    <!-- Loading -->
    <app-spinner *ngIf="loading()"></app-spinner>

    <!-- Liste -->
    <div class="blog-list" *ngIf="!loading() && blogs().length > 0; else noBlogs">
      <mat-card class="blog-card" *ngFor="let blog of blogs()">
        <mat-card-title>{{ blog.title }}</mat-card-title>
        <mat-card-subtitle>
          von {{ blog.author }} am {{ blog.createdAt | date }}
        </mat-card-subtitle>

        <mat-card-content>
          <ng-container *ngIf="blog.content; else noContent">
            <p>{{ blog.content.slice(0, 120) }}...</p>
          </ng-container>
          <ng-template #noContent>
            <p><em>(Kein Inhalt vorhanden)</em></p>
          </ng-template>
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
  private readonly store = inject(BlogStore);

  blogs = this.store.entities;
  loading = this.store.loading;

  ngOnInit() {
    this.store.loadAll;
  }
}
