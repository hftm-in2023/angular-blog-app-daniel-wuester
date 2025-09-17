// src/app/shared/services/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Blog } from '../../shared/models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly apiUrl = '/entries'; // <- RELATIV, damit der Proxy greift

  constructor(private readonly _http: HttpClient) {}

  private toBlog = (raw: any): Blog => ({
    id: Number(raw.id),
    title: String(raw.title ?? ''),
    content: String(raw.content ?? ''),
    author: String(raw.author ?? 'Unknown'),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  });

  getBlogs(): Observable<Blog[]> {
    return this._http.get<any[]>(this.apiUrl).pipe(map((items) => items.map(this.toBlog)));
  }

  getBlogById(id: number): Observable<Blog> {
    return this._http.get<any>(`${this.apiUrl}/${id}`).pipe(map(this.toBlog));
  }

  addBlog(blog: Pick<Blog, 'title' | 'content'>): Observable<Blog> {
    const payload = {
      title: blog.title,
      content: blog.content,
      author: 'Unknown',
      createdAt: new Date().toISOString(),
    };
    return this._http.post<any>(this.apiUrl, payload).pipe(map(this.toBlog));
  }
}
