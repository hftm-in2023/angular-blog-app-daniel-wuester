import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';

function hasAnyRole(u: any, roles: string[]): boolean {
  if (!u) return false;
  const realm = Array.isArray(u?.realm_access?.roles) ? u.realm_access.roles : [];
  const client = Object.values(u?.resource_access ?? {}).flatMap((r: any) => r?.roles ?? []);
  return roles.some((r) => realm.includes(r) || client.includes(r));
}

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const oidc = inject(OidcSecurityService);
  const router = inject(Router);

  try {
    const res = await firstValueFrom(oidc.checkAuth());
    const isAuth = !!res?.isAuthenticated;
    const user = res?.userData;

    if (isAuth && hasAnyRole(user, ['user'])) return true;

    router.navigateByUrl('/blogs');
    return false;
  } catch {
    router.navigateByUrl('/blogs');
    return false;
  }
};
