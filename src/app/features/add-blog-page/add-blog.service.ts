import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export type CreatedBlog = {
  title: string;
  content: string;
};

@Injectable({ providedIn: 'root' })
export class AddBlogService {
  private http = inject(HttpClient);

  async addBlog(blog: CreatedBlog): Promise<any> {
    return lastValueFrom(this.http.post('/entries', blog));
  }
}
