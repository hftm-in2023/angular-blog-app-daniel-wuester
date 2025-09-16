import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, filter, distinctUntilChanged, switchMap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <ng-container *ngIf="blog$ | async as blog; else loading">
      <h2>{{ blog.title }}</h2>
      <p>
        <strong>von:</strong> {{ blog.author }} — <strong>am:</strong>
        {{ blog.createdAt | date: 'yyyy-MM-dd' }}
      </p>
      <p>{{ blog.content }}</p>

      <button mat-stroked-button (click)="goBack()"><mat-icon>arrow_back</mat-icon> Zurück</button>
    </ng-container>

    <ng-template #loading><p>Lade…</p></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(BlogService);
  private location = inject(Location);

  blog$: Observable<Blog> = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    filter((id) => Number.isFinite(id)),
    distinctUntilChanged(),
    switchMap((id) => this.api.getBlogById(id)),
    shareReplay(1),
  );

  goBack() {
    this.location.back();
  }
}
