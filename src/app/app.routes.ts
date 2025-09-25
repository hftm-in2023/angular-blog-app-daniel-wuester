import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'blogs' },

  {
    path: 'logged-out',
    loadComponent: () =>
      import('./core/logged-out/logged-out.component').then((m) => m.LoggedOutComponent),
  },

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
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./features/add-blog-page/add-blog.routes').then((m) => m.routes),
  },

  { path: '**', redirectTo: 'blogs' },
];
