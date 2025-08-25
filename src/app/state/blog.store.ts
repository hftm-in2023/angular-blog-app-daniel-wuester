import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Blog } from '../shared/models/blog.model';
import { BlogService } from '../shared/services/blog.service';
import { BlogActions, BlogAction } from './blog.actions';

export interface BlogState {
  entities: Blog[];
  selectedId: string | number | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class BlogStore {
  private readonly _state = signal<BlogState>({
    entities: [],
    selectedId: null,
    loading: false,
    error: null,
  });

  readonly entities = computed(() => this._state().entities);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly selected = computed(() => {
    const s = this._state();
    return s.entities.find((b) => String(b.id) === String(s.selectedId)) ?? null;
  });

  constructor(private readonly api: BlogService) {}

  dispatch(action: BlogAction<Blog>) {
    const s = this._state();

    switch (action.type) {
      case BlogActions.load:
        this._state.set({ ...s, loading: true, error: null });
        break;

      case BlogActions.loadSuccess:
        this._state.set({ ...s, entities: action.payload, loading: false, error: null });
        break;

      case BlogActions.loadFailure:
        this._state.set({ ...s, loading: false, error: action.error });
        break;

      case BlogActions.add:
        this._state.set({ ...s, entities: [...s.entities, action.payload] });
        break;

      case BlogActions.update:
        this._state.set({
          ...s,
          entities: s.entities.map((b) =>
            String(b.id) === String(action.payload.id) ? action.payload : b,
          ),
        });
        break;

      case BlogActions.remove:
        this._state.set({
          ...s,
          entities: s.entities.filter((b) => String(b.id) !== String(action.payload)),
        });
        break;
    }
  }

  loadAll() {
    this.dispatch({ type: BlogActions.load });
    this.api
      .getBlogs()
      .pipe(finalize(() => {}))
      .subscribe({
        next: (blogs) => this.dispatch({ type: BlogActions.loadSuccess, payload: blogs }),
        error: (err) =>
          this.dispatch({
            type: BlogActions.loadFailure,
            error: err?.message ?? 'Fehler beim Laden',
          }),
      });
  }

  select(id: string | number | null) {
    const s = this._state();
    this._state.set({ ...s, selectedId: id });
  }
}
