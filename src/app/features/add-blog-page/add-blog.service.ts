import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type CreatedBlog = { title: string; content: string };

@Injectable({ providedIn: 'root' })
export class AddBlogService {
  private http = inject(HttpClient);

  async addBlog(blog: CreatedBlog): Promise<any> {
    return lastValueFrom(this.http.post(`${environment.apiBase}/entries`, blog));
  }

  getAll() {
    return this.http.get(`${environment.apiBase}/entries`);
  }

  getById(id: number) {
    return this.http.get(`${environment.apiBase}/entries/${id}`);
  }
}
