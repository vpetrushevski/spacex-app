import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageObject } from '../models/shared.model';
import { LaunchType } from '../enums/launch-type.enum';

@Injectable({
  providedIn: 'root',
})

export class SharedService {

  /**
   * Public variables
   */
  show_spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show_cover_spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  is_app_reloading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  is_mobile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  pages: Array<PageObject> = [
    {
      pageName: 'Latest Launch',
      pageUrl: LaunchType.Latest,
      pageIcon: 'bi-rocket-takeoff'
    },
    {
      pageName: 'Upcoming Launches',
      pageUrl: LaunchType.Upcoming,
      pageIcon: 'bi-rocket'
    },
    {
      pageName: 'Past Launches',
      pageUrl: LaunchType.Past,
      pageIcon: 'bi-clock-history'
    }
  ];

  constructor() { }
}
