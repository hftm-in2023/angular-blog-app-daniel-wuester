import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-blog-page',
  imports: [CommonModule],
  template: `
    <h2>Neuen Blogpost erstellen</h2>
    <p>(Form außerhalb des Scopes dieser Aufgabe)</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogPageComponent {}
