import { Component, Input } from '@angular/core';

import { LaunchpadObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-launchpad-card',
  standalone: true,
  imports: [],
  templateUrl: './launchpad-card.html',
  styleUrl: './launchpad-card.scss'
})
export class LaunchpadCard {

  /**
   * Inputs
   */
  @Input() launchpad: LaunchpadObject | null = null;
}
