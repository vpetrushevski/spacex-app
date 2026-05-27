import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LaunchService } from '../../../core/services/launch.service';
import { LaunchDetails } from '../launch-details/launch-details';
import { LaunchObject } from '../../../core/models/launch.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-latest-launch',
  imports: [MatProgressSpinnerModule, LaunchDetails],
  templateUrl: './latest-launch.html',
  styleUrl: './latest-launch.scss',
})
export class LatestLaunch implements OnInit, OnDestroy {

  /**
   * Public variables
   */
  public show_spinner: boolean = false;
  public launch: LaunchObject | null = null;

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _launchService: LaunchService,
              private _snackBar: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  public ngOnInit(): void {
    this.getLatestLaunch();
  }

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to get latest launch
   */
  public getLatestLaunch(): void {
    this.show_spinner = true;

    this._launchService.getLatestLaunch().pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.show_spinner = false;
          this._changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response: LaunchObject) => {
          this.launch = response ?? null;
        },
        error: (error) => {
          this.launch = null;
          this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
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
