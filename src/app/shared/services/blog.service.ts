// src/app/shared/services/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Blog } from '../../shared/models/blog.model'; // <-- Model importieren

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly apiUrl = `${environment.apiBase}/entries`; // Backend liefert /entries (ohne /api hinter dem Proxy)

  constructor(private readonly _http: HttpClient) {}

  // Liste: Backend liefert { data: [...] } mit contentPreview (kein content)
  getBlogs(): Observable<Blog[]> {
    return this._http
      .get<{ data: any[] }>(this.apiUrl)
      .pipe(map((res) => (res?.data ?? []).map((raw) => this.mapListItem(raw))));
  }

  // Detail: Backend liefert i. d. R. das Objekt direkt ODER als { data: {...} }
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

  // --- Mapper ---
  private mapListItem = (raw: any): Blog => ({
    id: Number(raw?.id),
    title: String(raw?.title ?? ''),
    // Liste hat nur contentPreview -> als content verwenden, damit Typ passt
    content: String(raw?.contentPreview ?? ''),
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
}
