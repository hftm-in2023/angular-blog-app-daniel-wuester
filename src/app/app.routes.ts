import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/blog-list/blog-list.routes').then(m => m.blogListRoutes)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./features/blog-detail/blog-detail.routes').then(m => m.blogDetailRoutes)
  }
];
