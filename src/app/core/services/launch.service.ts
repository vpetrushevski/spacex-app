import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError, Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CapsuleObject, CrewMemberObject, LandpadObject, LaunchObject, LaunchpadObject, PaginatedLaunchesResponseObject, RocketObject, ShipObject } from '../models/launch.model';

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

  /**
 * Function to get launch details
 */
public getLaunchDetails(launchId: string): Observable<LaunchObject> {
  return this._httpClient.get<LaunchObject>(this._api_url + `${launchId}`).pipe(
    map((response: LaunchObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get rocket details
 */
public getRocketDetails(rocketId: string): Observable<RocketObject> {
  return this._httpClient.get<RocketObject>(this._api_url + `rocket/${rocketId}`).pipe(
    map((response: RocketObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get launchpad details
 */
public getLaunchpadDetails(launchpadId: string): Observable<LaunchpadObject> {
  return this._httpClient.get<LaunchpadObject>(this._api_url + `launchpad/${launchpadId}`).pipe(
    map((response: LaunchpadObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get landpad details
 */
public getLandpadDetails(landpadId: string): Observable<LandpadObject> {
  return this._httpClient.get<LandpadObject>(this._api_url + `landpad/${landpadId}`).pipe(
    map((response: LandpadObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get crew member details
 */
public getCrewMemberDetails(crewMemberId: string): Observable<CrewMemberObject> {
  return this._httpClient.get<CrewMemberObject>(this._api_url + `crew-member/${crewMemberId}`).pipe(
    map((response: CrewMemberObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get capsule details
 */
public getCapsuleDetails(capsuleId: string): Observable<CapsuleObject> {
  return this._httpClient.get<CapsuleObject>(this._api_url + `capsule/${capsuleId}`).pipe(
    map((response: CapsuleObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}

/**
 * Function to get ship details
 */
public getShipDetails(shipId: string): Observable<ShipObject> {
  return this._httpClient.get<ShipObject>(this._api_url + `ship/${shipId}`).pipe(
    map((response: ShipObject) => {
      return response;
    }),
    catchError((error: HttpErrorResponse) => this._handleError(error))
  );
}
}
