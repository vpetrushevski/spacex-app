import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../core/services/shared.service';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit, OnDestroy {
  /**
   * Public variables
   */
  show_spinner = signal(false);

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _sharedService: SharedService,
              private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
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
   * Function to subscribe to spinner
   */
  private _subscribeToSpinner(): void {
    this._sharedService.show_spinner.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: boolean) => {
        this.show_spinner.set(response);
        // this._changeDetectorRef.detectChanges();
      }
    });
  }
}
