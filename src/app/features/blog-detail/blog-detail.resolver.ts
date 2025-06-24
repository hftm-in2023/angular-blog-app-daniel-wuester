import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Blog } from '../../shared/models/blog.model';
import { BlogService } from '../../shared/services/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogDetailResolver implements Resolve<Blog> {
  constructor(private blogService: BlogService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Blog> {
    const id = Number(route.paramMap.get('id'));
    return this.blogService.getBlogById(id);
  }
}
