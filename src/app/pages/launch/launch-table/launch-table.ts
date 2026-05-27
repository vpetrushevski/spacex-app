import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SortDirection } from '../../../core/enums/sort-direction.enum';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GetLaunchesRequestObject, LaunchObject } from '../../../core/models/launch.model';
import { LaunchType } from '../../../core/enums/launch-type.enum';
import { LaunchTableDataSource } from './launch-table-datasource';
import { LaunchService } from '../../../core/services/launch.service';

@Component({
  selector: 'app-launch-table',
  imports: [CommonModule, MatTableModule, MatSortModule, MatProgressSpinnerModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './launch-table.html',
  styleUrl: './launch-table.scss'
})
export class MissionTable implements OnInit, AfterViewInit, OnDestroy {

  /**
   * View Child
   */
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LaunchObject>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Public variables
   */
  type!: LaunchType;
  pageTitle = '';
  show_spinner = false;

  dataSource!: LaunchTableDataSource;

  displayedColumns: string[] = [
    'flightNumber',
    'name',
    'dateUtc',
    'landingType',
    'status',
    'options'
  ];

  /**
   * Private variables
   */
  private _unsubscribeAll = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _launchService: LaunchService,
    private _snackBar: MatSnackBar
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._subscribeToDataSource();
    this._subscribeToRouteParams();
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.sort.sortChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.dataSource.sortData(this.sort);
      });

    this.paginator.page
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._getLaunches();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to subscribe to datasource
   */
  private _subscribeToDataSource(): void {
    this.dataSource = new LaunchTableDataSource(
      this._launchService,
      this._snackBar
    );

    this.dataSource.loading$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: boolean) => this.show_spinner = data);
  }

  /**
   * Function to subscribe to route parameters
   */
  private _subscribeToRouteParams(): void {
    this._route.paramMap
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (params: ParamMap) => {
          this.type = params.get('type') as LaunchType;

          if (this.type !== LaunchType.Upcoming && this.type !== LaunchType.Past) {
            this._router.navigate(['/launches/latest']);
            return;
          }

          this._setPageTitle();

          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }

          this._getLaunches();
        }
      });
  }

  /**
   * Function to get launches
   */
  private _getLaunches(): void {
    const request = new GetLaunchesRequestObject();

    request.page = this.paginator ? this.paginator.pageIndex + 1 : 1;
    request.limit = this.paginator ? this.paginator.pageSize : 10;

    switch (this.type) {
      case LaunchType.Upcoming:
        request.upcoming = true;
        request.sortDirection = SortDirection.Asc
        break;

      case LaunchType.Past:
        request.upcoming = false;
        request.sortDirection = SortDirection.Desc;
        break;
    }

    this.dataSource.loadMissionsData(request);
  }

  /**
   * Function to set page title
   */
  private _setPageTitle(): void {
    switch (this.type) {
      case LaunchType.Upcoming:
        this.pageTitle = 'Upcoming';
        break;

      case LaunchType.Past:
        this.pageTitle = 'Past';
        break;
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to view launch details
   */
  goToLaunchDetails(id: string): void {
    this._router.navigate(['/launches/details'], {
      queryParams: { id }
    });
  }
}
