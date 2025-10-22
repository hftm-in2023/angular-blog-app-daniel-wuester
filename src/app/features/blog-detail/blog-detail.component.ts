import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { map, filter, distinctUntilChanged, switchMap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/models/blog.model';
import { CommentService } from '../../shared/services/comment.service';
import { Comment } from '../../shared/models/comment.model';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerComponent,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(BlogService);
  private location = inject(Location);
  private commentsSvc = inject(CommentService);
  private fb = inject(FormBuilder);
  private oidc = inject(OidcSecurityService);

  private _isAuthenticated = signal(false);
  isAuthenticated = computed(() => this._isAuthenticated());

  private _user = signal<any>(null);
  displayName = computed(() => {
    const u = this._user();
    return u?.preferred_username || u?.name || u?.email || 'User';
  });

  private _blogId = signal<number | null>(null);

  blog$: Observable<Blog> = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    filter((id) => Number.isFinite(id)),
    distinctUntilChanged(),
    switchMap((id) => this.api.getBlogById(id)),
    shareReplay(1),
  );

  comments$: Observable<Comment[]> = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    filter((id) => Number.isFinite(id)),
    distinctUntilChanged(),
    switchMap((id) => this.commentsSvc.getComments$(id)),
  );

  commentForm = this.fb.nonNullable.group({
    text: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
  });

  constructor() {
    this.oidc.isAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe((res: any) => this._isAuthenticated.set(!!res?.isAuthenticated));

    this.oidc.userData$
      .pipe(takeUntilDestroyed())
      .subscribe((res: any) => this._user.set(res?.userData ?? null));

    this.route.paramMap
      .pipe(
        map((pm) => Number(pm.get('id'))),
        filter((id) => Number.isFinite(id)),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((id) => this._blogId.set(id));
  }

  toggleLike(id: number) {
    this.api.toggleLike(id);
  }
  isLiked(id: number): boolean {
    return this.api.isLiked(id);
  }

  submitComment(): void {
    if (!this.isAuthenticated()) return;
    if (this.commentForm.invalid) return;

    const id = this._blogId();
    if (!id) return;

    const text = this.commentForm.controls.text.value.trim();
    if (!text) return;

    this.commentsSvc.addComment(id, text, this.displayName());
    this.commentForm.reset();
  }

  goBack() {
    this.location.back();
  }

  trackById = (_: number, c: { id: number }) => c.id;
}
