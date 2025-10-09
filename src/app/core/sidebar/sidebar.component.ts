import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { hasRole } from '../../shared/auth/has-role';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private oidc = inject(OidcSecurityService);
  private bo = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  private _isAuthenticated = signal(false);
  private _userData = signal<any>(null);
  private _busy = signal(false);

  busy = computed(() => this._busy());

  isAuthenticated = computed(() => this._isAuthenticated());
  displayName = computed(() => {
    const u = this._userData();
    return u?.preferred_username || u?.name || u?.email || 'User';
  });
  canAddBlog = computed(() => this._isAuthenticated() && hasRole(this._userData(), 'user'));

  isHandset$ = this.bo.observe(Breakpoints.Handset).pipe(
    map((r) => r.matches),
    shareReplay({ bufferSize: 1, refCount: true }),
    takeUntilDestroyed(this.destroyRef),
  );
  isHandset = toSignal(this.isHandset$, { initialValue: false });

  closeIfHandset(drawer: any) {
    if (this.isHandset()) drawer.close();
  }

  // sidebar.component.ts (oben in der Klasse, vor dem constructor)
  readonly rawLoginUrl =
    `${environment.auth.authority}/protocol/openid-connect/auth` +
    `?client_id=${encodeURIComponent(environment.auth.clientId)}` +
    `&redirect_uri=${encodeURIComponent(environment.auth.redirectUrl)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent('openid profile email offline_access')}` +
    `&prompt=login`;

  constructor() {
    // isAuthenticated$ liefert { isAuthenticated: boolean, ... }
    this.oidc.isAuthenticated$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      console.log('[OIDC] isAuthenticated$ =>', res);
      const isAuth = !!res?.isAuthenticated;
      this._isAuthenticated.set(isAuth);

      // WICHTIG: Busy immer beenden, wenn ein Auth-Result angekommen ist
      this._busy.set(false);
    });

    // userData$ liefert { userData, ... }
    this.oidc.userData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      console.log('[OIDC] userData$ =>', res);
      this._userData.set(res?.userData ?? null);
    });
  }

  authToggle() {
    if (this._isAuthenticated()) {
      this.logout();
    } else {
      this.login();
    }
  }

  login() {
    if (!this._isAuthenticated()) {
      this._busy.set(true);
      console.log('[OIDC] authorize() via library');
      this.oidc.authorize();
    }
  }

  async logout() {
    console.log('[OIDC] logout()');

    try {
      await firstValueFrom(this.oidc.checkAuth().pipe(catchError(() => of(null))));
    } catch {
      /* empty */
    }

    let idToken: string | null = null;
    try {
      idToken = await firstValueFrom(this.oidc.getIdToken());
    } catch {
      /* empty */
    }

    this.oidc.logoffLocal();
    this._isAuthenticated.set(false);
    this._userData.set(null);
    this._busy.set(false);

    try {
      for (const store of [localStorage, sessionStorage]) {
        const keys = Object.keys(store);
        keys
          .filter(
            (k) =>
              k.toLowerCase().includes('oidc') ||
              k.toLowerCase().includes('angular-auth-oidc-client') ||
              k.toLowerCase().includes('auth'),
          )
          .forEach((k) => store.removeItem(k));
      }
      console.log('[OIDC] local/sessionStorage cleaned');
    } catch {
      /* empty */
    }

    const endSession = `${environment.auth.authority}/protocol/openid-connect/logout`;
    const clientId = environment.auth.clientId;
    const redirect = environment.auth.postLogoutRedirectUri || window.location.origin;

    const params = new URLSearchParams({
      post_logout_redirect_uri: redirect,
      client_id: clientId,
    });
    if (idToken) params.set('id_token_hint', idToken);

    const url = `${endSession}?${params.toString()}`;
    console.log('[OIDC] redirecting to logout:', url);

    window.location.href = url;
  }
}
