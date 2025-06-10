import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // NEU: Für @if, @for, @switch, NgClass, NgStyle
import { FormsModule } from '@angular/forms'; // NEU: Für [(ngModel)]

// NEU: Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider'; // Falls mat-divider verwendet wird

interface User {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true, // Beibehalten, da Ihre app.ts bereits standalone ist
  imports: [
    CommonModule, // Hinzufügen
    FormsModule, // Hinzufügen
    // Angular Material Module hier hinzufügen
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
  styleUrl: './app.scss' // Hier `styleUrl` statt `styleUrls` beibehalten, da es nur eine ist
})
export class AppComponent { // Ihre Klasse heisst "App"
  protected title = 'Angular Material Demo App von Daniel Wüster'; // Angepasst für Demo

  // Demo-Logik
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