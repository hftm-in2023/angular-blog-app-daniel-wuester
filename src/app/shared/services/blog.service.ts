import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Blog } from '../../shared/models/blog.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly apiUrl = `${environment.apiBase}/entries`;

  constructor(private readonly _http: HttpClient) {}

  getBlogs(): Observable<Blog[]> {
    return this._http.get<any>(this.apiUrl).pipe(
      map((items) => (Array.isArray(items?.data) ? items.data : items)),
      map((arr: any[]) => arr.map((x) => this.mapListItem(x))),
    );
  }

  getBlogById(id: number): Observable<Blog> {
    return this._http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => this.mapDetailItem(res?.data ?? res)));
  }

  addBlog(blog: Pick<Blog, 'title' | 'content'>): Observable<Blog> {
    const payload = { title: blog.title, content: blog.content ?? '' };
    return this._http
      .post<any>(this.apiUrl, payload)
      .pipe(map((raw) => this.mapDetailItem(raw?.data ?? raw)));
  }

  toggleLike(blogId: number): void {
    const key = 'blog-likes';
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    stored[blogId] = !stored[blogId];
    localStorage.setItem(key, JSON.stringify(stored));
  }

  isLiked(blogId: number): boolean {
    const key = 'blog-likes';
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    return !!stored[blogId];
  }

  private mapListItem = (raw: any): Blog => ({
    id: Number(raw?.id),
    title: String(raw?.title ?? ''),
    content: String(raw?.contentPreview ?? raw?.content ?? ''),
    author: String(raw?.author ?? 'Unknown'),
    createdAt: String(raw?.createdAt ?? new Date().toISOString()),
  });

  private mapDetailItem = (raw: any): Blog => ({
    id: Number(raw?.id),
    title: String(raw?.title ?? ''),
    content: String(raw?.content ?? raw?.contentPreview ?? ''),
    author: String(raw?.author ?? 'Unknown'),
    createdAt: String(raw?.createdAt ?? new Date().toISOString()),
  });
}
