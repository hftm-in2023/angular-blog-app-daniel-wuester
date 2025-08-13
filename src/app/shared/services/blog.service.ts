// blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly apiUrl = `${environment.apiBaseUrl}/entries`;

  constructor(private _http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  addBlog(blog: Blog): Observable<Blog> {
    return this._http.post<Blog>(this.apiUrl, blog);
  }

  getBlogById(id: number): Observable<Blog> {
    return this._http.get<Blog>(`${this.apiUrl}/${id}`);
  }
}
