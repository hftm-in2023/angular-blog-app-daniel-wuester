import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

type Store = Record<number, Comment[]>;
const STORAGE_KEY = 'blog-comments';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private store$: BehaviorSubject<Store>;

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const initial: Store = raw ? JSON.parse(raw) : {};
    for (const k of Object.keys(initial)) {
      const id = Number(k);
      initial[id] = (initial[id] ?? []).filter((c) => !!c?.text?.trim());
    }
    this.store$ = new BehaviorSubject<Store>(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }

  private persist(nextStore: Store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore));
    this.store$.next(nextStore);
  }

  getComments$(blogId: number): Observable<Comment[]> {
    return this.store$.pipe(
      map((s) => (s[blogId] ?? []).slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt))),
    );
  }

  addComment(blogId: number, text: string, author?: string): void {
    const trimmed = (text ?? '').trim();
    if (!trimmed) return;

    const current = this.store$.value;
    const list = current[blogId] ?? [];
    const newItem: Comment = {
      id: Date.now(),
      blogId,
      author: (author ?? '').trim() || 'Anonymous',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const next: Store = { ...current, [blogId]: [...list, newItem] };
    this.persist(next);
  }
}
