import { Component, OnInit } from '@angular/core';
import { Blog } from '../../shared/models/blog.model';
import { BlogService } from '../../shared/services/blog.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-blog-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  template: `
    <h2>Blogübersicht</h2>

    <div class="blog-list" *ngIf="blogs.length > 0; else noBlogs">
      <mat-card class="blog-card" *ngFor="let blog of blogs">
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
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (res: any) => {
        console.log('Antwort vom Backend:', res);
        this.blogs = res.data;
      },
      error: (err) => console.error('Fehler beim Laden:', err),
    });
  }
}
