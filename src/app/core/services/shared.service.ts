import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  constructor() { }
}
