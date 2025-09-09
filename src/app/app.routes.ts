import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/blog-list/blog-list.routes').then((m) => m.blogListRoutes),
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./features/blog-detail/blog-detail.routes').then((m) => m.blogDetailRoutes),
  },
  {
    path: 'add-blog',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>
      import('./features/add-blog-page/add-blog.routes').then((m) => m.ADD_BLOG_ROUTES),
  },
];
