import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const correlationId = crypto.randomUUID();
    const modified = req.clone({
      setHeaders: {
        'X-Correlation-Id': correlationId
      }
    });
    return next.handle(modified);
  }
}
