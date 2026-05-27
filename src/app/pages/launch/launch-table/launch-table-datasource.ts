import { DataSource } from '@angular/cdk/collections';
import { HttpParams, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { SortDirection } from '../../../core/enums/sort-direction.enum';
import { LaunchService } from '../../../core/services/launch.service';
import { GetLaunchesRequestObject, LaunchObject, PaginatedLaunchesResponseObject } from '../../../core/models/launch.model';

export class LaunchTableDataSource extends DataSource<LaunchObject> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalMissionsCountSubject = new BehaviorSubject<number>(0);

  public missionsSubject = new BehaviorSubject<LaunchObject[]>([]);
  public loading$ = this.loadingSubject.asObservable();
  public totalMissionsCount$ = this.totalMissionsCountSubject.asObservable();

  public show_table = false;
  public no_missions = false;
  public loading_missions = true;

  sort: MatSort | undefined;

  constructor(private _lauchService: LaunchService,
              private _snackBar: MatSnackBar
  ) {
    super();
  }

  loadMissionsData(request: GetLaunchesRequestObject): void {
    this.loadingSubject.next(true);
    this.loading_missions = true;

    let params = new HttpParams()
      .set('page', request.page)
      .set('limit', request.limit)
      .set('sortDirection', request.sortDirection ?? SortDirection.Desc);

    if (request.upcoming !== null) {
      params = params.set('upcoming', request.upcoming);
    }

    this._lauchService.getLaunches(params)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (response: PaginatedLaunchesResponseObject) => {
          const launches = response?.launches ?? [];

          this.totalMissionsCountSubject.next(response?.totalDocs ?? 0);
          this.missionsSubject.next(launches);

          this.show_table = launches.length > 0;
          this.no_missions = launches.length === 0;
          this.loading_missions = false;
        },
        error: (error) => {
          if (error.error?.statusCode === HttpStatusCode.Unauthorized) {
            Swal.fire({
              icon: 'warning',
              text: 'Session expired. Please sign in again.',
              showConfirmButton: false,
              timer: 3000
            });
          } else {
            const errorMessage = error.error?.response ?? 'An error occurred. Please try again.';

            this._snackBar.open(errorMessage, undefined, {
              duration: 2000,
              panelClass: ['custom-snackbar']
            });
          }

          this.missionsSubject.next([]);
          this.totalMissionsCountSubject.next(0);
          this.show_table = false;
          this.no_missions = true;
          this.loading_missions = false;
        }
      });
  }

  connect(): Observable<LaunchObject[]> {
    return this.missionsSubject.asObservable();
  }

  disconnect(): void {
    this.missionsSubject.complete();
    this.totalMissionsCountSubject.complete();
    this.loadingSubject.complete();
  }

  sortData(sort: MatSort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const data = this.missionsSubject.value.slice();
    const isAsc = sort.direction === 'asc';

    switch (sort.active) {
      case 'flightNumber':
        this.missionsSubject.next(data.sort((a, b) => this.compare(a.flightNumber, b.flightNumber, isAsc)));
        break;

      case 'name':
        this.missionsSubject.next(data.sort((a, b) => this.compare(a.name, b.name, isAsc)));
        break;

      case 'dateUtc':
        this.missionsSubject.next(data.sort((a, b) =>
          this.compare(new Date(a.dateUtc).getTime(), new Date(b.dateUtc).getTime(), isAsc)
        ));
        break;

      default:
        break;
    }
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
  }
}
