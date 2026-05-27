import { Component, Input } from '@angular/core';

import { LandpadObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-landpad-card',
  imports: [],
  templateUrl: './landpad-card.html',
  styleUrl: './landpad-card.scss'
})
export class LandpadCard {

  /**
   * Inputs
   */
  @Input() landpads: LandpadObject[] = [];
}
