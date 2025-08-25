import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlogStore } from '../../state/blog.store';
import { BlogDetailViewComponent } from './components/blog-detail-view.component';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [NgIf, BlogDetailViewComponent, SpinnerComponent, MatIconModule, MatButtonModule],
  templateUrl: './blog-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(BlogStore);

  loading = this.store.loading;
  blog = this.store.selected;

  // Route → Auswahl
  private id = toSignal(this.route.paramMap, { initialValue: null as any });

  ngOnInit() {
    // Falls Liste noch nicht geladen → laden
    this.store.loadAll();

    // id aus URL übernehmen
    const blogId = this.route.snapshot.paramMap.get('id');
    this.store.select(blogId);
  }

  goBack() {
    history.back();
  }
}
