import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Blog } from '../../shared/models/blog.model';
import { environment } from '../../../environments/environment';

type LikesMap = Record<number, boolean>;
const LIKES_KEY = 'blog-likes';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly apiUrl = `${environment.apiBase}/entries`;

  // Zentrale, reaktive Quelle
  private readonly _likes$ = new BehaviorSubject<LikesMap>(this.loadLikes());

  constructor(private readonly _http: HttpClient) {}

  // ---------- Blogs ----------
  getBlogs(): Observable<Blog[]> {
    return this._http
      .get<any>(this.apiUrl)
      .pipe(map((items) => (items?.data || []).map(this.mapListItem)));
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

  // ---------- Likes (reaktiv) ----------
  isLiked$(blogId: number): Observable<boolean> {
    return this._likes$.pipe(
      map((m) => !!m[blogId]),
      distinctUntilChanged(),
    );
  }

  isLiked(blogId: number): boolean {
    return !!this._likes$.value[blogId];
  }

  toggleLike(blogId: number): void {
    const current = { ...this._likes$.value };
    current[blogId] = !current[blogId];
    this._likes$.next(current);
    this.saveLikes(current);
  }

  // ---------- Persistenz ----------
  private loadLikes(): LikesMap {
    try {
      return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private saveLikes(m: LikesMap) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(m));
  }

  // ---------- Mapper ----------
  private mapListItem = (raw: any): Blog => ({
    id: Number(raw?.id),
    title: String(raw?.title ?? ''),
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
}
