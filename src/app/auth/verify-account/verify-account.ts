import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute, Router, Params } from '@angular/router';
import { Subject, takeUntil, take, finalize } from 'rxjs';
import { AuthenticateErrorResponseObject, VerifyAccountRequestObject } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-verify-account',
  imports: [ReactiveFormsModule, RouterLink],

  templateUrl: './verify-account.html',
  styleUrl: './verify-account.scss',
})
export class VerifyAccount implements OnInit, OnDestroy {
  /**
   * Public variables
   */
  accountId = '';
  verificationToken = '';
  verifying_account = true;
  is_verified = false;
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
        this.accountId = params['uid'];
        this.verificationToken = params['token'];

        this._verifyAccount();
      }
    });
  }

  /**
   * Function to verify account
   */
  private _verifyAccount(): void {
    this._sharedService.show_spinner.next(true);

    let request = new VerifyAccountRequestObject();
    request.accountId = this.accountId;
    request.token = this.verificationToken;

    this._authService.verifyAccount(request).pipe(
      take(1),
      finalize(() => {
        this._sharedService.show_spinner.next(false);
        this.verifying_account = false;
        this._changeDetectorRef.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.is_verified = true;
      },
      error: (error) => {
        this.is_verified = true;
        this._handleVerifyAccountErrorResponse(error.error?.response ?? 'Internal error');
        this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
      }
    });
  }

  /**
   * Function to handle error verify response
   */
  private _handleVerifyAccountErrorResponse(response: string): void {
    this.authenticateErrorResponseObject.info = response;

    debugger
    switch(response) {
      case 'Account does not exist.':
        this.authenticateErrorResponseObject.title = 'Invalid account';
        break;
      case 'Verification token is missing.':
      case 'Verification token is invalid.':
        this.authenticateErrorResponseObject.title = 'Invalid token';
        break;
      case 'Account is already verified.':
        this.authenticateErrorResponseObject.title = 'Verified account';
        this.is_verified = true;
        break;
      case 'Account is blocked.':
        this.authenticateErrorResponseObject.title = 'Blocked account';
        this.is_verified = false;
        break;
      case 'Account is disabled.':
        this.authenticateErrorResponseObject.title = 'Disabled account';
        this.is_verified = false;
        break;
      default:
        this.authenticateErrorResponseObject.title = 'Internal error';
        this.authenticateErrorResponseObject.info = 'Some internal error occurred. Please try again';
        this.is_verified = false;
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
