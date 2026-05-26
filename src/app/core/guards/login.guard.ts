import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, switchMap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {

  constructor(private _cookieService: CookieService,
              private _authService: AuthService,
              private _sharedService: SharedService,
              private _router: Router,
              private _snackBar: MatSnackBar) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this._cookieService.get('SpaceXAccessToken')) {
      return this._authService.authorizeToken().pipe(
        switchMap(authorized => {
          if (authorized !== null) {
            this._snackBar.open('You are already logged in', '', {
              duration: 2000,
              panelClass: ['custom-snackbar']
            });

            this._router.navigate(['/missions']);
            this._sharedService.is_app_reloading.next(true);

            return of(false);
          }

          return of(true);
        })
      );
    }

    return of(true);
  }
}

export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(PermissionsService).canActivate(next, state);
};
