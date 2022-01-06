import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BpRequestInterceptor implements HttpInterceptor {
  private businessPackToken = '911d2237b89a0e4c607fd22e26d80671e5c99d99d1e632884544e6b675e3cbe0';

  public intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    if (request.url.includes(environment.bpUrl_Id)) {
      let params = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${this.businessPackToken}`),
        withCredentials: true,
      });
      return next.handle(params);
    }
    return next.handle(request);
  }
}
