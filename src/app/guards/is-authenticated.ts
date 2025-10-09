import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const oidc = inject(OidcSecurityService);
  const router = inject(Router);

  try {
    const res = await firstValueFrom(oidc.checkAuth());
    const isAuth = !!res?.isAuthenticated;

    if (isAuth) return true;

    router.navigateByUrl('/blogs');
    return false;
  } catch {
    router.navigateByUrl('/blogs');
    return false;
  }
};
