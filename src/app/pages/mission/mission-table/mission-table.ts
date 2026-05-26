import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MissionType } from '../../../core/enums/mission-type.enum';

@Component({
  selector: 'app-mission-table',
  imports: [],
  templateUrl: './mission-table.html',
  styleUrl: './mission-table.scss'
})
export class MissionTable implements OnInit, OnDestroy {

  /**
   * Public variables
   */
  type!: MissionType;

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(private _route: ActivatedRoute,
              private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._subscribeToRouteParams();
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
   * Function to subscribe to route params
   */
  private _subscribeToRouteParams(): void {
    this._route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (params: ParamMap) => {
        this.type = params.get('type') as MissionType;

        if (this.type != MissionType.Upcoming && this.type != MissionType.Past) {
          this._router.navigate(['/missions/latest']);
          return;
        }

        this._getMissions();
      }
    });
  }

  /**
   * Function to get missions
   */
  private _getMissions(): void {
    switch(this.type) {
      case MissionType.Upcoming:
        // TODO: call upcoming request
        break;
    case MissionType.Past:
      // TODO: call past request
      break;
    }
  }
}
