import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';

import { LaunchService } from '../../../core/services/launch.service';

import { CapsuleObject, CrewMemberObject, LandpadObject, LaunchObject, LaunchpadObject, RocketObject, ShipObject } from '../../../core/models/launch.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CapsuleCard } from './capsule-card/capsule-card';
import { CrewCard } from './crew-card/crew-card';
import { LandpadCard } from './landpad-card/landpad-card';
import { LaunchInfoCard } from './launch-info-card/launch-info-card';
import { LaunchpadCard } from './launchpad-card/launchpad-card';
import { RocketCard } from './rocket-card/rocket-card';
import { ShipCard } from './ship-card/ship-card';

@Component({
  selector: 'app-launch-details',
  imports: [MatProgressSpinnerModule, DatePipe, DecimalPipe, LaunchInfoCard, RocketCard, CapsuleCard, ShipCard, CrewCard, LaunchpadCard, LandpadCard],
  templateUrl: './launch-details.html',
  styleUrl: './launch-details.scss'
})
export class LaunchDetails implements OnInit, OnDestroy {

  /**
   * Input variables
   */
  @Input() set launch(value: LaunchObject | null) {
    this.launchData = value;

    if (value) {
      this.getLaunchRelatedDetails(value);
    }
  }

  /**
   * Public variables
   */
  public show_spinner: boolean = false;

  public launchData: LaunchObject | null = null;
  public rocket: RocketObject | null = null;
  public launchpad: LaunchpadObject | null = null;
  public landpads: LandpadObject[] = [];
  public crewMembers: CrewMemberObject[] = [];
  public capsules: CapsuleObject[] = [];
  public ships: ShipObject[] = [];

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _launchService: LaunchService,
              private _activatedRoute: ActivatedRoute,
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
    this._subscribeToQueryParams();
  }

  /**
   * On destroy
   */
  public ngOnDestroy(): void {
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
    this._activatedRoute.queryParamMap
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params) => {
        const launchId = params.get('id');

        if (launchId && !this.launchData) {
          this.getLaunchDetails(launchId);
        }
      });
  }

  /**
   * Function to get unique ids
   */
  private getUniqueIds(ids: string[]): string[] {
    return [...new Set(ids.filter(id => !!id))];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to get launch details
   */
  public getLaunchDetails(launchId: string): void {
    this.show_spinner = true;

    this._launchService.getLaunchDetails(launchId).pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.show_spinner = false;
          this._changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response: LaunchObject) => {
          this.launchData = response ?? null;

          if (this.launchData) {
            this.getLaunchRelatedDetails(this.launchData);
          }
        },
        error: (error) => {
          this.launchData = null;
          this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
        }
      });
  }

  /**
   * Function to get launch related details
   */
  public getLaunchRelatedDetails(launch: LaunchObject): void {
    this.show_spinner = true;

    const landpadIds = this.getUniqueIds(
      launch.cores
        ?.map(core => core.landpad)
        .filter(Boolean) ?? []
    );

    const crewMemberIds = this.getUniqueIds(
      launch.crew
        ?.map(crew => crew.crewId)
        .filter(Boolean) ?? []
    );

    const capsuleIds = this.getUniqueIds(launch.capsules ?? []);

    const shipIds = this.getUniqueIds(launch.ships ?? []);

    forkJoin({
      rocket: launch.rocket
        ? this._launchService.getRocketDetails(launch.rocket)
        : of(null),

      launchpad: launch.launchpad
        ? this._launchService.getLaunchpadDetails(launch.launchpad)
        : of(null),

      landpads: landpadIds.length
        ? forkJoin(landpadIds.map(landpadId => this._launchService.getLandpadDetails(landpadId)))
        : of([]),

      crewMembers: crewMemberIds.length
        ? forkJoin(crewMemberIds.map(crewMemberId => this._launchService.getCrewMemberDetails(crewMemberId)))
        : of([]),

      capsules: capsuleIds.length
        ? forkJoin(capsuleIds.map(capsuleId => this._launchService.getCapsuleDetails(capsuleId)))
        : of([]),

      ships: shipIds.length
        ? forkJoin(shipIds.map(shipId => this._launchService.getShipDetails(shipId)))
        : of([])
    })
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.show_spinner = false;
          this._changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.rocket = response.rocket ?? null;
          this.launchpad = response.launchpad ?? null;

          this.landpads = response.landpads.filter((landpad): landpad is LandpadObject => landpad !== null);
          this.crewMembers = response.crewMembers.filter((crewMember): crewMember is CrewMemberObject => crewMember !== null);
          this.capsules = response.capsules.filter((capsule): capsule is CapsuleObject => capsule !== null);
          this.ships = response.ships.filter((ship): ship is ShipObject => ship !== null);
        },
        error: (error) => {
          this.openSnackBar(error.error?.response ?? 'Some technical issue occurred. Please try again');
        }
      });
  }

  /**
   * Function to open snack-bar
   */
  public openSnackBar(message: string): void {
    this._snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['custom-snackbar']
    });
  }
}
