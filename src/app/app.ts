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

import { BlogService, Blog } from './shared/services/blog.service';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';


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
    MatDividerModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  protected title = 'Angular Material Demo App von Daniel Wüster';

  buttonClickedCount = 0;
  isContentVisible = true;
  selectedOption = 'option1';
  users: User[] = [
    { id: 1, name: 'Alice', isActive: true },
    { id: 2, name: 'Bob', isActive: false },
    { id: 3, name: 'Charlie', isActive: true },
  ];
  messageColor = 'blue';
  isHighlighted = false;
  twoWayBindingText = 'Hallo Welt!';

  blogs: Blog[] = [];

  // Formular-Daten für neuen Blogeintrag
  newBlog: Partial<Blog> = {
    title: '',
    content: '',
    author: '',
  };

  constructor(private blogService: BlogService) {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (response: any) => {
        console.log('Empfangene Blogs:', response);
        this.blogs = response.data;
      },
      error: (err) => console.error('Fehler beim Laden der Blogs:', err),
    });
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
