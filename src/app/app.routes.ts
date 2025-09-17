import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'blogs' },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./features/blog-list/blog-list.routes').then((m) => m.blogListRoutes),
  },
  {
    path: 'blogs/:id',
    loadChildren: () =>
      import('./features/blog-detail/blog-detail.routes').then((m) => m.blogDetailRoutes),
  },
  {
    path: 'add-blog',
    loadChildren: () =>
      import('./features/add-blog-page/add-blog.routes').then((m) => m.ADD_BLOG_ROUTES),
  },
  { path: '**', redirectTo: 'blogs' },
];
