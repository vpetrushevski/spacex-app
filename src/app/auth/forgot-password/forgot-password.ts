import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, take, finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SharedService } from '../../core/services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword  implements OnDestroy {

  /**
   * Public variables
   */
  email = new FormControl<string>('', { nonNullable: true });
  is_email_registered = true;
  is_reset_code_correct = true;

  show_reset_password_form = true;
  show_resend_email = false;
  failed_sending_email = false;
  sending_email_error = '';

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _authService: AuthService,
              private _sharedService: SharedService,
              private _snackBar: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to check email
   */
  checkEmail(): void {
    this.is_email_registered = true;

    this._authService.isEmailRegistered(this.email.value).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: boolean) => {
        this.is_email_registered = response;
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Function to get reset password token by email
   */
  sendResetPasswordToken(): void {
    this._sharedService.show_spinner.next(true);
    this.failed_sending_email = false;

    this._authService.sendResetPasswordToken(this.email.value).pipe(
      take(1),
      finalize(() => {
        this._sharedService.show_spinner.next(false);
      })
    ).subscribe({
      next: () => {
        this.show_reset_password_form = false;
        this.show_resend_email = true;
      },
      error: (error) => {
        this.show_reset_password_form = true;
        this.failed_sending_email = true;
        this.sending_email_error = error.error?.response;
      }
    });
  }

  /**
   * Function to resend reset password token by email
   */
  resendResetPasswordToken(): void {
    this._sharedService.show_spinner.next(true);
    this.failed_sending_email = false;

    this._authService.resendResetPasswordToken(this.email.value).pipe(
      take(1),
      finalize(() => {
        this._sharedService.show_spinner.next(false);
      })
    ).subscribe({
      next: () => {
        this.openSnackBar('Forgot password email resent');
      },
      error: (error) => {
        this.show_reset_password_form = true;
        this.failed_sending_email = true;
        this.sending_email_error = error.error?.response;
      }
    });
  }

  /**
   * Function to open snack-bar
   */
  openSnackBar(message: string): void {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['custom-snackbar']
    });
  }
}
