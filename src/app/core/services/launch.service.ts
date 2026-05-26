import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LaunchObject, PaginatedLaunchesResponseObject } from '../models/launch.model';

@Injectable({
  providedIn: 'root',
})
export class LaunchService {

  /**
   * Private Variables
   */
  private readonly _httpClient = inject(HttpClient);
  private readonly _api_url = `${environment.API_URL}/launch/`;

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
   * Function to get latest launch
   */
  public getLatestLaunch(): Observable<LaunchObject> {
    return this._httpClient.get<LaunchObject>(this._api_url + `latest`,).pipe(
      map((response: LaunchObject) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }

  /**
   * Function to get upcoming/past launches
   */
  public getLaunches(request: HttpParams): Observable<PaginatedLaunchesResponseObject> {
    return this._httpClient.get<PaginatedLaunchesResponseObject>(this._api_url + `list`, { params: request }).pipe(
      map((response: PaginatedLaunchesResponseObject) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => this._handleError(error))
    );
  }
}
