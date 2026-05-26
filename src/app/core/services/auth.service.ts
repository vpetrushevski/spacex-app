import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { throwError, Observable, map, catchError, of, BehaviorSubject } from 'rxjs';

import { SharedService } from './shared.service';
import { environment } from '../../../environments/environment';
import { AccountDetailsObject } from '../models/account.model';
import { ChangePasswordRequestObject, LoginRequestObject, LoginResponseObject, LogoutRequestObject, RefreshTokenRequestObject, ResetPasswordRequestObject, VerifyAccountRequestObject } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Public variables
   */
  currentActiveAccount: AccountDetailsObject | null = null;
  currentActiveAccountSubject: BehaviorSubject<AccountDetailsObject | null> = new BehaviorSubject<AccountDetailsObject | null>(null);

  /**
   * Private Variables
   */
  private readonly _httpClient = inject(HttpClient);
  private readonly _cookieService = inject(CookieService);
  private readonly _sharedService = inject(SharedService);
  private readonly _router = inject(Router);
  private readonly _api_url = `${environment.API_URL}/authentication/`;

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

  /**
   * Function to set tokens
   */
  private _setTokens(accessToken: string, refreshToken: string): void {
    this.deleteTokens();

    this._cookieService.set('SpaceXAccessToken', accessToken, 10000000000000, '/');
    this._cookieService.set('SpaceXRefreshToken', refreshToken, 10000000000000, '/');
  }

  /**
   * Function to set account response
   */
  private _setAccountData(response: AccountDetailsObject): void {
    this.currentActiveAccount = response;
    this.currentActiveAccountSubject.next(response);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to check if email is existing
   */
  public isEmailRegistered(email: string): Observable<boolean> {
    return this._httpClient.get<boolean>(this._api_url + `check-email/${encodeURIComponent(email)}`).pipe(
      map((response: boolean) => response),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to login
   */
  public login(request: LoginRequestObject): Observable<LoginResponseObject> {
    return this._httpClient.post<LoginResponseObject>(this._api_url + `login`, request).pipe(
      map((response: LoginResponseObject) => {
        this._sharedService.show_cover_spinner.next(true);

        this._setAccountData(response.account);
        this._setTokens(response.accessToken, response.refreshToken);
        this._router.navigate(['/launches']);

        setTimeout(() => {
          this._sharedService.show_cover_spinner.next(false);
        }, 500);

        return response;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to authorize access token
   */
  public authorizeToken(): Observable<AccountDetailsObject | null> {
    this._sharedService.show_cover_spinner.next(true);

    if (!this.isTokenHeaderEmpty()) {
      return this._httpClient.get<LoginResponseObject>(this._api_url + `authorize`).pipe(
        map((response: LoginResponseObject) => {
          if (response) {
            this._setAccountData(response.account);
            this._setTokens(response.accessToken, response.refreshToken);

            this._sharedService.show_cover_spinner.next(false);

            return response.account;
          }

          throw new Error('Access token is expired.');
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.error?.response === 'Access token is expired.' || error.error?.response === 'Access token is invalid.') {
            return this.refreshTokens();
          }

          this.deleteTokens();

          this._router.navigate(['/auth/login']);
          this._sharedService.show_cover_spinner.next(false);

          return throwError(() => error);
        })
      );
    }

    this._router.navigate(['/auth/login']);
    this._sharedService.show_cover_spinner.next(false);

    return of(null);
  }

  /**
   * Function to refresh tokens
   */
  public refreshTokens(): Observable<AccountDetailsObject | null> {
    this._sharedService.show_cover_spinner.next(true);

    const request: RefreshTokenRequestObject = new RefreshTokenRequestObject();
    request.accessToken = this._cookieService.get('SpaceXAccessToken');
    request.refreshToken = this._cookieService.get('SpaceXRefreshToken');

    return this._httpClient.post<LoginResponseObject>(this._api_url + `refresh-token`, request).pipe(
      map((response: LoginResponseObject) => {
        this._setAccountData(response.account);
        this._setTokens(response.accessToken, response.refreshToken);

        this._sharedService.show_cover_spinner.next(false);

        return response.account;
      }),
      catchError(() => {
        this._sharedService.show_cover_spinner.next(false);

        return of(null);
      })
    );
  }

  /**
   * Function to delete tokens
   */
  public deleteTokens(): void {
    this._cookieService.delete('SpaceXAccessToken', '/');
    this._cookieService.delete('SpaceXRefreshToken', '/');
  }

  /**
   * Function to return true for saved token, false for empty token
   */
  public isTokenHeaderEmpty(): boolean {
    const tokenCookie = this._cookieService.get('SpaceXAccessToken');

    return !tokenCookie;
  }

  /**
   * Function to logout
   */
  public logOut(): Observable<void | null> {
    const request: LogoutRequestObject = new LogoutRequestObject();
    request.refreshToken = this._cookieService.get('SpaceXRefreshToken');

    return this._httpClient.post<void>(this._api_url + `logout`, request).pipe(
      map(() => {
        this.deleteTokens();

        this._router.navigate(['/auth/login']);

        setTimeout(() => {
          this._sharedService.show_cover_spinner.next(false);
        }, 500);

        return;
      }),
      catchError(() => {
        this.deleteTokens();

        this._router.navigate(['/auth/login']);

        setTimeout(() => {
          this._sharedService.show_cover_spinner.next(false);
        }, 500);

        return of(null);
      })
    );
  }

  /**
   * Function to resend verification
   */
  public resendVerificationEmail(email: string): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `${encodeURIComponent(email)}/resend-verification-email`, null).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to verify account
   */
  public verifyAccount(request: VerifyAccountRequestObject): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `verify`, request).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to send reset password token by email
   */
  public sendResetPasswordToken(email: string): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `${encodeURIComponent(email)}/forgot-password`, null).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to resend reset password token by email
   */
  public resendResetPasswordToken(email: string): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `${encodeURIComponent(email)}/resend-forgot-password`, null).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to reset password
   */
  public resetPassword(request: ResetPasswordRequestObject): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `reset-password`, request).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to change password
   */
  public changePassword(request: ChangePasswordRequestObject): Observable<void> {
    return this._httpClient.post<void>(this._api_url + `change-password`, request).pipe(
      map(() => {
        return;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }
}
