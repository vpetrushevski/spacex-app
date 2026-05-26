import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { SharedService } from '../../../core/services/shared.service';
import { AccountDetailsObject } from '../../../core/models/account.model';
import { Settings } from '../../../pages/shared/settings/settings';
import { PageObject } from '../../../core/models/shared.model';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive, Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  /**
   * Inputs
   */
  @Input() pagesList: Array<PageObject> = [];

  /**
   * Public variables
   */
  is_mobile = false;
  toggle_sidebar = false;
  currentActiveAccount: AccountDetailsObject = new AccountDetailsObject();

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _authService: AuthService,
              private _sharedService: SharedService,
              private _matDialog: MatDialog,
              private _changeDetectorRef: ChangeDetectorRef) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._subscribeToCurrentActiveUser();
    this._subscribeToIsMobile();
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
   * Function to subscribe to current active user
   */
  private _subscribeToCurrentActiveUser(): void {
    this._authService.currentActiveAccountSubject.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data: AccountDetailsObject | null) => {
        if (data) {
          this.currentActiveAccount = data;
        }
      }
    });
  }

  /**
   * Function to subscribe to is_mobile
   */
  private _subscribeToIsMobile(): void {
    this._sharedService.is_mobile.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (data: boolean) => {
        this.is_mobile = data;
        this._changeDetectorRef.detectChanges();
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to toggle sidebar
   */
  toggleSidebar(): void {
    this.toggle_sidebar = !this.toggle_sidebar;
  }

  /**
   * Function to close sidebar
   */
  closeSidebar(): void {
    if (this.toggle_sidebar && this.is_mobile) {
      this.toggle_sidebar = false;
    }
  }

  /**
   * Function to open change password dialog
   */
  changePassword(): void {
    this._matDialog.open(Settings, {
      width: '620px',
      maxWidth: '95vw',
      panelClass: 'settings-dialog'
    });
  }

  /**
   * Function to logout
   */
  logOut(): void {
    this._sharedService.show_cover_spinner.next(true);

    this._authService.logOut().pipe(take(1)).subscribe();
  }
}
