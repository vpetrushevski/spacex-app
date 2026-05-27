import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { RocketObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-rocket-card',
  imports: [DecimalPipe],
  templateUrl: './rocket-card.html',
  styleUrl: './rocket-card.scss'
})
export class RocketCard {

  /**
   * Inputs
   */
  @Input() rocket: RocketObject | null = null;
}
