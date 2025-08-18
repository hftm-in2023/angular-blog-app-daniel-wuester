import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as _DetailView from './components/blog-detail-view.component';

@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    _DetailView.BlogDetailViewComponent,
  ],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Resolver-Daten ins Feld schreiben:
  blog: Blog | undefined = this.route.snapshot.data['blog'] as Blog;

  goBack(): void {
    this.router.navigate(['/']); // oder '/blogs'
  }
}
