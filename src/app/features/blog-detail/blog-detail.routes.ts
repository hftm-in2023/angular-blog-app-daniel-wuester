import { Routes } from '@angular/router';
import { BlogDetailComponent } from './blog-detail.component';
import { BlogDetailResolver } from './blog-detail.resolver';

export const blogDetailRoutes: Routes = [
  {
    path: ':id',
    component: BlogDetailComponent,
    resolve: {
      blog: BlogDetailResolver
    }
  }
];
