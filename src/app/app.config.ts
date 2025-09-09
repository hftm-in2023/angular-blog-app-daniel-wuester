import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { GlobalErrorHandler } from './shared/error/global-error.handler';
import { CorrelationIdInterceptor } from './shared/interceptors/correlation-id.interceptor';

import { routes } from './app.routes';

import { provideAuth } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(withInterceptorsFromDi()),

    // OIDC / Keycloak Config aus environment.auth
    provideAuth({
      config: {
        authority: environment.auth.authority,
        redirectUrl: environment.auth.redirectUrl,
        postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
        clientId: environment.auth.clientId,
        scope: environment.auth.scope,
        responseType: environment.auth.responseType,
        silentRenew: environment.auth.silentRenew,
        useRefreshToken: environment.auth.useRefreshToken,
      },
    }),

    // Error Handling und Interceptors
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true },
  ],
};
