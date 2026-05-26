import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageObject } from '../models/shared.model';
import { MissionType } from '../enums/mission-type.enum';

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
      pageName: 'Latest Mission',
      pageUrl: MissionType.Latest,
      pageIcon: 'bi-rocket-takeoff'
    },
    {
      pageName: 'Upcoming Missions',
      pageUrl: MissionType.Upcoming,
      pageIcon: 'bi-rocket'
    },
    {
      pageName: 'Past Missions',
      pageUrl: MissionType.Past,
      pageIcon: 'bi-clock-history'
    }
  ];

  constructor() { }
}
