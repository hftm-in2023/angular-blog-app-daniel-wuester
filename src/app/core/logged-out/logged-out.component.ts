import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Du bist abgemeldet</h1>
    <p>Du kannst dich jederzeit wieder anmelden.</p>

    >
  `,
})
export class LoggedOutComponent {}
