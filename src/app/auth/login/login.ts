import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { AuthenticateErrorResponseObject, LoginRequestObject, LoginResponseObject } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {

  /**
   * Public variables
   */
  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  is_email_registered = true;
  is_password_correct = true;
  password_input_type_text = false;
  failed_login = false;
  show_resend_verification_email_button = false;
  authenticateErrorResponseObject: AuthenticateErrorResponseObject = new AuthenticateErrorResponseObject();

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _sharedService: SharedService,
              private _snackBar: MatSnackBar) {
    this._initLoginForm();
  }

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
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to init login form
   */
  private _initLoginForm(): void {
    this.loginForm = this._formBuilder.group({
      email: this._formBuilder.nonNullable.control('', Validators.required),
      password: this._formBuilder.nonNullable.control('', Validators.required)
    });
  }

  /**
   * Function to handle login error response
   */
  private _handleLoginErrorResponse(response: string): void {
    this.authenticateErrorResponseObject.info = `${response}. You can't login to your account`;

    switch(response) {
      case 'Email is not registered yet.':
      case 'Invalid account status.':
        this.authenticateErrorResponseObject.title = 'Invalid account';
        break;
      case 'Account is not verified.':
        this.authenticateErrorResponseObject.title = 'Account not verified';
        this.show_resend_verification_email_button = true;
        break;
      case 'Account is blocked.':
        this.authenticateErrorResponseObject.title = 'Blocked account';
        break;
      case 'Account is disabled.':
        this.authenticateErrorResponseObject.title = 'Disabled account';
        break;
      default:
        this.authenticateErrorResponseObject.title = "Internal error";
        this.authenticateErrorResponseObject.info = "Some internal error occurred. Please try again";
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to check email
   */
  checkEmail(): void {
    this.is_email_registered = true;

    let email: string = this.loginForm.controls.email.value;

    this._authService.isEmailRegistered(email).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: boolean) => {
        this.is_email_registered = response;
      }
    });
  }

  /**
   * Function to login
   */
  login(): void {
    this.is_password_correct = true;
    this._sharedService.show_spinner.next(true);

    let request = new LoginRequestObject();
    request.email = this.loginForm.controls.email.value;
    request.password = this.loginForm.controls.password.value;

    this._authService.login(request).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => this._sharedService.show_spinner.next(false))
    ).subscribe({
      next: () => {},
      error: (error) => {
        if (error.error?.response === 'Wrong password.') {
          this.is_password_correct = false;
        }
        else {
          this.failed_login = true;
          this._handleLoginErrorResponse(error.error?.response ?? 'Internal error');
        }
      }
    });
  }

  /**
   * Function to resend verification email
   */
  resendVerificationEmail(): void {
    this._sharedService.show_spinner.next(true);

    let email: string = this.loginForm.controls.email.value;

    this._authService.resendVerificationEmail(email).pipe(take(1)).subscribe({
      next: () => {
        this.openSnackBar('Verification email resent');
        this._sharedService.show_spinner.next(false);
      },
      error: (error) => {
        this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
        this._sharedService.show_spinner.next(false); }
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
