import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { hasRole } from '../../shared/auth/has-role';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <!-- Menü-Icon -->
      <button mat-icon-button [matMenuTriggerFor]="mainMenu" aria-label="Main menu">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- App-Name verlinkt auf Home -->
      <a routerLink="/" class="brand">BlogApp</a>

      <span class="spacer"></span>

      <!-- Benutzername -->
      <span class="user" *ngIf="isAuthenticated()">
        {{ displayName() }}
      </span>

      <!-- Add Blog nur für Rolle user -->
      <a mat-stroked-button *ngIf="canAddBlog()" routerLink="/add-blog">
        <mat-icon>add</mat-icon>
        New Blog
      </a>

      <!-- Login/Logout -->
      <button mat-flat-button color="accent" *ngIf="!isAuthenticated()" (click)="login()">
        Login
      </button>
      <button mat-stroked-button *ngIf="isAuthenticated()" (click)="logout()">Logout</button>
    </mat-toolbar>

    <!-- Menüdefinition -->
    <mat-menu #mainMenu="matMenu">
      <button mat-menu-item routerLink="/"><mat-icon>home</mat-icon><span>Home</span></button>
      <button mat-menu-item routerLink="/blogs">
        <mat-icon>list</mat-icon><span>Alle Blogs</span>
      </button>
      <!-- immer zeigen -->
      <button mat-menu-item routerLink="/add-blog">
        <mat-icon>add</mat-icon><span>Blog neu erstellen</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .brand {
        text-decoration: none;
        color: inherit;
        margin-left: 8px;
        font-weight: 600;
      }
      .spacer {
        flex: 1 1 auto;
      }
      .user {
        margin-right: 12px;
        opacity: 0.9;
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
