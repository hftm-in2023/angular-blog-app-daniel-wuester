import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAuth, AuthInterceptor, OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, firstValueFrom, of } from 'rxjs';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { CorrelationIdInterceptor } from './shared/interceptors/correlation-id.interceptor';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'de-CH' },

    provideHttpClient(withInterceptorsFromDi()),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),

    provideAuth({
      config: {
        authority: environment.auth.authority,
        redirectUrl: environment.auth.redirectUrl,
        postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
        clientId: environment.auth.clientId,
        scope: environment.auth.scope,
        responseType: environment.auth.responseType,
        silentRenew: false,
        silentRenewUrl: environment.auth.silentRenewUrl,
        renewTimeBeforeTokenExpiresInSeconds: environment.auth.renewTimeBeforeTokenExpiresInSeconds,
        secureRoutes: ['/api', environment.serviceUrl],
        customParamsAuthRequest: { prompt: 'login' },
      },
    }),

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const oidc = inject(OidcSecurityService);
        return () =>
          firstValueFrom(
            oidc.checkAuth().pipe(
              catchError((err) => {
                console.warn('[OIDC] initial checkAuth ignored:', err?.message || err);
                return of({ isAuthenticated: false, userData: null });
              }),
            ),
          );
      },
    },

    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
