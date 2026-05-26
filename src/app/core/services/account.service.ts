import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAccountRequestObject } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  /**
   * Private Variables
   */
  private readonly _httpClient = inject(HttpClient);
  private readonly _api_url = `${environment.API_URL}/account`;

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function for handling errors
   *
   * @param { HttpErrorResponse } error
   *
   */
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    }
    else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return throwError(() => error);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to create account
   */
  public createAccount(request: CreateAccountRequestObject): Observable<void> {
    return this._httpClient.post<void>(this._api_url, request).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }
}
