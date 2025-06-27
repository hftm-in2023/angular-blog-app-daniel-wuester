import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { BlogService } from '../../shared/services/blog.service';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { BlogSchema } from '../../shared/models/blog.schema';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailResolver implements Resolve<Blog> {
  constructor(
    private blogService: BlogService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Blog> {
  const id = Number(route.paramMap.get('id'));
  return this.blogService.getBlogById(id).pipe(
    map(data => {
      const result = BlogSchema.safeParse(data);
      if (!result.success) {
        throw new Error('Blog-Daten ungültig');
      }
      return result.data;
    }),
    catchError(err => {
      this.snackBar.open('Blog ungültig oder nicht gefunden', 'Schließen', { duration: 4000 });
      this.router.navigate(['/']);
      return EMPTY;
    })
  );
}
}
