import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from '../../guards/is-authenticated';

export const routes: Routes = [
  {
    path: '',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./add-blog-page.component').then((m) => m.AddBlogComponent),
  },
];
