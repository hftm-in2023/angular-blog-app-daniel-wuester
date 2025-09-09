import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'], // <-- styleUrls (Plural) und als Array
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
