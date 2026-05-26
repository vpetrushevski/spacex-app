import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { SharedService } from './core/services/shared.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  protected readonly title = signal('Space X | Hornet Security');

  /**
   * Public variables
   */
  show_spinner = signal(false);

  /**
   * Private variables
   */
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _sharedService: SharedService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._checkIsMobile();
    this._subscribeToSpinner();
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
   * Function to check is mobile
   */
  private _checkIsMobile(): void {
    this._breakpointObserver.observe(['(max-width: 991px)']).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: BreakpointState) => {
        this._sharedService.is_mobile.next(response.matches);
      }
    })
  }

  /**
   * Function to subscribe to spinner
   */
  private _subscribeToSpinner(): void {
    this._sharedService.show_cover_spinner.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: boolean) => {
        this.show_spinner.set(response);
      }
    })
  }
}
