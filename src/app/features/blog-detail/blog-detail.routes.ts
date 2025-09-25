import { Routes } from '@angular/router';

export const blogDetailRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog-detail.component').then((m) => m.BlogDetailComponent),
  },
];
