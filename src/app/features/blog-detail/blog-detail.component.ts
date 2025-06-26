import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  standalone: true,
  selector: 'app-blog-detail',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent {
  blog: Blog | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.blog = this.route.snapshot.data['blog'];
  }

  goBack(): void {
    this.router.navigate(['/']); // alternativ: ['/blogs']
  }
}
