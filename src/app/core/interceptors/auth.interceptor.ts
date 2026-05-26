import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenValue: string = this._cookieService.get('SpaceXAccessToken');

    req = req.clone({
      setHeaders: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenValue}`
      }
    });

    return next.handle(req);
  }
}
