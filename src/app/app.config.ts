import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // importProvidersFrom hinzufügen
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // FormsModule importieren
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './shared/error/global-error.handler';
import { CorrelationIdInterceptor } from './shared/interceptors/correlation-id.interceptor';

import { routes } from './app.routes';
importProvidersFrom(HttpClientModule, FormsModule);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule, FormsModule),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true},
  ],
};
