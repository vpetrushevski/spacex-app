import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params, RouterLink } from '@angular/router';
import { Subject, takeUntil, take, finalize } from 'rxjs';
import { AuthenticateErrorResponseObject, ResetPasswordRequestObject } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { SharedService } from '../../core/services/shared.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit, OnDestroy {
  /**
   * Public variables
   */
  accountId = '';
  resetPasswordToken = '';

  newPassword = new FormControl<string>('', { nonNullable: true });
  repeatNewPassword = new FormControl<string>('', { nonNullable: true });

  password_input_type_text = false;
  repeat_password_input_type_text = false;
  password_match = true;
  show_new_password_form = true;
  changed_password = false;
  show_auth_error_response = false;

  authenticateErrorResponseObject: AuthenticateErrorResponseObject = new AuthenticateErrorResponseObject();

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _sharedService: SharedService,
              private _authService: AuthService,
              private _snackBar: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._subscribeToQueryParams();
    this._checkPasswordMatch();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to subscribe to query params
   */
  private _subscribeToQueryParams(): void {
    this._route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (params: Params) => {
        this.accountId = params['uid'] ?? '';
        this.resetPasswordToken = params['token'] ?? '';
      }
    });
  }

  /**
   * Function to check if new password match
   */
  private _checkPasswordMatch(): void {
    this.repeatNewPassword.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: string) => {
        this.password_match = this.newPassword.value === response;
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Function to handle change password error response
   */
  private _handleChangePasswordErrorResponse(response: string): void {
    this.show_auth_error_response = true;
    this.authenticateErrorResponseObject.info = `${response} You can't change your password`;

    switch(response) {
      case 'Account does not exist.':
        this.authenticateErrorResponseObject.title = 'Invalid account';
        break;
      case 'Account is not verified.':
        this.authenticateErrorResponseObject.title = 'Account not verified';
        break;
      case 'Account is blocked.':
        this.authenticateErrorResponseObject.title = 'Blocked account';
        break;
      case 'Account is disabled.':
        this.authenticateErrorResponseObject.title = 'Disabled account';
        break;
      case 'Invalid account status.':
        this.authenticateErrorResponseObject.title = 'Invalid account';
        break;
      case 'Password reset token is not valid.':
        this.authenticateErrorResponseObject.title = 'Invalid token';
        break;
      case 'Password reset token is expired.':
        this.authenticateErrorResponseObject.title = 'Expired token';
        break;
      default:
        this.authenticateErrorResponseObject.title = 'Internal error';
        this.authenticateErrorResponseObject.info = 'Some internal error occurred. Please try again';
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to change password
   */
  changePassword(): void {
    this._sharedService.show_spinner.next(true);

    let request = new ResetPasswordRequestObject();
    request.accountId = this.accountId;
    request.resetPasswordToken = this.resetPasswordToken;
    request.newPassword = this.newPassword.value;

    this._authService.resetPassword(request).pipe(
      take(1),
      finalize(() => {
        this._sharedService.show_spinner.next(false);
        this._changeDetectorRef.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.show_new_password_form = false;
        this.changed_password = true;
      },
      error: (error) => {
        this.show_new_password_form = false;
        this._handleChangePasswordErrorResponse(error.error?.response ?? 'Internal error');
      }
    });
  }

  /**
   * Function to open snack-bar
   */
  openSnackBar(message: string): void {
    let snack = this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['custom-snackbar']
    });

    snack.afterDismissed().pipe(take(1)).subscribe({
      next: () => {
        this._router.navigate(['/auth/login']);
      }
    });
  }
}
