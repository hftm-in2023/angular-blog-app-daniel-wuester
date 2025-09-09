import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';
import { hasRole } from '../shared/auth/has-role';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(OidcSecurityService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map(({ isAuthenticated, userData }) => {
      const ok = isAuthenticated && hasRole(userData, 'user');
      return ok ? true : router.parseUrl('/');
    }),
  ) as unknown as boolean | UrlTree;
};
