import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, filter, distinctUntilChanged, switchMap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './blog-detail.component.html',
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
