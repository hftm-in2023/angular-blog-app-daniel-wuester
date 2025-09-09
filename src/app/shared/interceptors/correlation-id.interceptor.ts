import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isAuthServerUrl } from '../../shared/auth/oidc-urls';

@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isAuthServerUrl(req.url)) {
      return next.handle(req);
    }
    const corrReq = req.clone({
      setHeaders: { 'X-Correlation-Id': crypto.randomUUID() },
    });
    return next.handle(corrReq);
  }
}
