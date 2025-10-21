import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <h1>{{ 'LOGOUT.YOU_ARE_LOGGED_OUT' | translate }}</h1>
    <p>{{ 'LOGOUT.MESSAGE' | translate }}</p>

    >
  `,
})
export class LoggedOutComponent {}
