// logging.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isAuthServerUrl } from '../auth/oidc-urls';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isAuthServerUrl(req.url)) {
      return next.handle(req);
    }
    console.log('HTTP Request:', req);
    return next.handle(req).pipe(tap((event) => console.log('HTTP Response:', event)));
  }
}
