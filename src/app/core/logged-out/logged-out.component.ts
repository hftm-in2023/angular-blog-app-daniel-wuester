import { Component } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'LOGOUT.YOU_ARE_LOGGED_OUT' | translate }}</h1>
    <p>{{ 'LOGOUT.MESSAGE' | translate }}</p>

    >
  `,
})
export class LoggedOutComponent {}
