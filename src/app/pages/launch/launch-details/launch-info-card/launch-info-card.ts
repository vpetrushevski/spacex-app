import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { LaunchObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-launch-info-card',
  imports: [DatePipe],
  templateUrl: './launch-info-card.html',
  styleUrl: './launch-info-card.scss'
})
export class LaunchInfoCard {

  /**
   * Inputs
   */
  @Input() launch: LaunchObject | null = null;
  @Input() crewMembersCount: number = 0;
  @Input() shipsCount: number = 0;
}
