import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, filter, distinctUntilChanged, switchMap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { signal, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(BlogService);
  private location = inject(Location);
  private oidc = inject(OidcSecurityService);

  private _isAuthenticated = signal(false);
  isAuthenticated = computed(() => this._isAuthenticated());

  blog$: Observable<Blog> = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    filter((id) => Number.isFinite(id)),
    distinctUntilChanged(),
    switchMap((id) => this.api.getBlogById(id)),
    shareReplay(1),
  );

  constructor() {
    this.oidc.isAuthenticated$.subscribe((res) => {
      this._isAuthenticated.set(!!res?.isAuthenticated);
    });
  }

  toggleLike(id: number) {
    this.api.toggleLike(id);
  }

  isLiked(id: number): boolean {
    return this.api.isLiked(id);
  }

  goBack() {
    this.location.back();
  }
}
