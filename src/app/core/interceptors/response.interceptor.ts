import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body === null || event.body === undefined) {
            return event;
          }

          if (event.body?.isSuccess === false) {
            throw new HttpErrorResponse({
              error: {
                response: event.body.response ?? event.body.message ?? 'Internal error'
              },
              status: event.status,
              statusText: event.statusText,
              url: event.url ?? undefined
            });
          }

          if (event.body?.isSuccess === true) {
            return event.clone({ body: event.body.response });
          }

          return event.clone({ body: event.body });
        }

        return event;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function for handling errors
   *
   * @param { HttpErrorResponse } error
   *
   */
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(() => error)
  }
}
