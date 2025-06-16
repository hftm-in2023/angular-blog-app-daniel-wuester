import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { BlogService, Blog } from './blog.service';

interface User {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  protected title = 'Angular Material Demo App von Daniel Wüster';

  buttonClickedCount = 0;
  isContentVisible = true;
  selectedOption = 'option1';
  users: User[] = [
    { id: 1, name: 'Alice', isActive: true },
    { id: 2, name: 'Bob', isActive: false },
    { id: 3, name: 'Charlie', isActive: true }
  ];
  messageColor = 'blue';
  isHighlighted = false;
  twoWayBindingText = 'Hallo Welt!';

  blogs: Blog[] = [];

  // Formular-Daten für neuen Blogeintrag
  newBlog: Partial<Blog> = {
    title: '',
    content: '',
    author: ''
  };

  constructor(private blogService: BlogService) {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => this.blogs = data,
      error: (err) => console.error('Fehler beim Laden der Blogs:', err)
    });
  }

  submitBlog(): void {
    if (this.newBlog.title && this.newBlog.content && this.newBlog.author) {
      const blog: Blog = {
        id: 0, // wird vom Backend ignoriert
        title: this.newBlog.title,
        content: this.newBlog.content,
        author: this.newBlog.author,
        createdAt: new Date().toISOString()
      };

      this.blogService.addBlog(blog).subscribe({
        next: (savedBlog) => {
          this.blogs.push(savedBlog);
          this.newBlog = { title: '', content: '', author: '' };
        },
        error: (err) => console.error('Fehler beim Speichern:', err)
      });
    }
  }

  onButtonClick(): void {
    this.buttonClickedCount++;
  }

  toggleContent(): void {
    this.isContentVisible = !this.isContentVisible;
  }

  toggleHighlight(): void {
    this.isHighlighted = !this.isHighlighted;
  }

  userById(index: number, user: User): number {
    return user.id;
  }
}
