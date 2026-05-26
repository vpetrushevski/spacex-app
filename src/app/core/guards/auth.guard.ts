import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, map, of } from "rxjs";

import { AuthService } from "../services/auth.service";
import { SharedService } from "../services/shared.service";
import { AccountDetailsObject } from "../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _authService: AuthService,
              private _sharedService: SharedService,
              private _router: Router,
              private _snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (this._sharedService.is_app_reloading.value) {
      return this._authService.authorizeToken().pipe(
        map((data: AccountDetailsObject | null) => {
          this._sharedService.is_app_reloading.next(false);

          if (data) {
            return true;
          }

          this._snackBar.open('Session expired. Please login again', '', {
            duration: 2000,
            panelClass: ['custom-snackbar']
          });

          this._authService.deleteTokens();
          this._router.navigate(['/auth/register']);

          return false;
        })
      );
    }

    return of(true);
  }
}
