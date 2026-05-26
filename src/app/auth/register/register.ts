import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, finalize, take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SharedService } from '../../core/services/shared.service';
import { AccountService } from '../../core/services/account.service';
import { CreateAccountRequestObject } from '../../core/models/account.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnDestroy {

  /**
   * Public variables
   */
  registerForm!: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  is_email_registered = false;
  password_input_type_text = false;
  show_register_form = true;
  successful_register = false;

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _accountService: AccountService,
              private _sharedService: SharedService,
              private _snackBar: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef) {
    this._initRegisterForm();
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
  private _initRegisterForm(): void {
    this.registerForm = this._formBuilder.group({
      firstName: this._formBuilder.nonNullable.control('', Validators.required),
      lastName: this._formBuilder.nonNullable.control('', Validators.required),
      email: this._formBuilder.nonNullable.control('', Validators.required),
      password: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])[A-Za-z0-9!.@#$%^&*]{8,16}$')
      ])
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to check email
   */
  checkEmail(): void {
    this.is_email_registered = false;

    let email: string = this.registerForm.controls.email.value;

    this._authService.isEmailRegistered(email).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: boolean) => {
        this.is_email_registered = response;
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Function to register
   */
  register(): void {
    this._sharedService.show_spinner.next(true);

    let request = new CreateAccountRequestObject();
    request.firstName = this.registerForm.controls.firstName.value;
    request.lastName = this.registerForm.controls.lastName.value;
    request.email = this.registerForm.controls.email.value;
    request.password = this.registerForm.controls.password.value;

    this._accountService.createAccount(request).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => this._sharedService.show_spinner.next(false))
    ).subscribe({
      next: () => {
        this.show_register_form = false;
        this.successful_register = true;
        this._changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
      }
    });
  }

  /**
   * Function to resend verification email
   */
  resendVerificationEmail(): void {
    this._sharedService.show_spinner.next(true);

    let email: string = this.registerForm.controls.email.value;

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
