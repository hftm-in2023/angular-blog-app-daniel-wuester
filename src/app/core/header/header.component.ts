import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { hasRole } from '../../shared/auth/has-role';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="left">
        <a routerLink="/">BlogApp</a>
      </div>

      <div class="right">
        <span *ngIf="isAuthenticated()">
          {{ displayName() }}
        </span>

        <a *ngIf="canAddBlog()" routerLink="/add-blog" class="add-btn">+ Add Blog</a>

        <button *ngIf="!isAuthenticated()" (click)="login()">Login</button>
        <button *ngIf="isAuthenticated()" (click)="logout()">Logout</button>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
      }
      .add-btn {
        margin: 0 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly oidc = inject(OidcSecurityService);

  private _isAuthenticated = signal(false);
  private _userData = signal<any>(null);

  isAuthenticated = computed(() => this._isAuthenticated());
  displayName = computed(() => {
    const u = this._userData();
    return u?.preferred_username || u?.name || u?.email || 'User';
  });
  canAddBlog = computed(() => this._isAuthenticated() && hasRole(this._userData(), 'user'));

  constructor() {
    this.oidc.checkAuth().subscribe({
      next: ({ isAuthenticated, userData }) => {
        this._isAuthenticated.set(isAuthenticated);
        this._userData.set(userData);
        console.log('[OIDC] isAuthenticated:', isAuthenticated, userData);
      },
      error: (e) => {
        console.error('[OIDC] checkAuth error:', e);
        // alert(JSON.stringify(e)); // nur kurzzeitig, wenn nötig
      },
    });
  }

  login() {
    this.oidc.authorize();
  }

  logout() {
    this.oidc.logoff().subscribe();
  }
}
