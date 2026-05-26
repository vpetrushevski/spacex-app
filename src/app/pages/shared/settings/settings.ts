import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, finalize, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { ChangePasswordRequestObject } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, NgClass, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit, OnDestroy {

  /**
   * Public variables
   */
  show_spinner = false;
  changePasswordForm!: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  is_current_password_correct = true;
  new_password_match = true;
  current_password_input_type_text = false;
  new_password_input_type_text = false;
  confirm_password_input_type_text = false;

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  /**
   * Function to get password form control
   */
  get new_password(): FormControl<string> {
    return this.changePasswordForm.controls.newPassword;
  }

  constructor(private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _matDialogRef: MatDialogRef<Settings>,
              private _snackBar: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef) {
    this._initChangePasswordForm();
    this._matDialogRef.disableClose = true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
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
   * Function to init change password form
   */
  private _initChangePasswordForm(): void {
    this.changePasswordForm = this._formBuilder.group({
      currentPassword: this._formBuilder.nonNullable.control('', Validators.required),
      newPassword: this._formBuilder.nonNullable.control('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])[A-Za-z0-9!.@#$%^&*]{8,16}$')
      ]),
      confirmPassword: this._formBuilder.nonNullable.control('', Validators.required)
    });
  }

  /**
   * Function to check if new password match
   */
  private _checkPasswordMatch(): void {
    this.changePasswordForm.controls.confirmPassword.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: string) => {
        this.new_password_match = this.changePasswordForm.controls.newPassword.value === response;
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to change password
   */
  changePassword(): void {
    this.show_spinner = true;
    this.is_current_password_correct = true;

    let request = new ChangePasswordRequestObject();
    request.currentPassword = this.changePasswordForm.controls.currentPassword.value;
    request.newPassword = this.changePasswordForm.controls.newPassword.value;

    this._authService.changePassword(request).pipe(
      take(1),
      finalize(() => {
        this.show_spinner = false;
        this._changeDetectorRef.detectChanges();
      })
    ).subscribe({
      next: () => {
        this._snackBar.open('Password changed successfully', '', {
          duration: 2000,
          panelClass: ['custom-snackbar']
        });

        this._matDialogRef.close(true);
      },
      error: (error) => {
        if (error.error?.statusCode === HttpStatusCode.Unauthorized) {
          Swal.fire({
            icon: 'warning',
            text: 'Session expired. Please sign in again.',
            showConfirmButton: false,
            timer: 3000
          });

          return;
        }

        if (error.error?.response === 'Wrong current password.') {
          this.is_current_password_correct = false;
          this._changeDetectorRef.detectChanges();
          return;
        }

        let errorMessage = error.error?.response ?? 'Something went wrong. Please try again.';

        this._snackBar.open(errorMessage, '', {
          duration: 2000,
          panelClass: ['custom-snackbar']
        });
      }
    });
  }
}
