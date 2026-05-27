import { Component, Input } from '@angular/core';

import { ShipObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-ship-card',
  standalone: true,
  imports: [],
  templateUrl: './ship-card.html',
  styleUrl: './ship-card.scss'
})
export class ShipCard {

  /**
   * Inputs
   */
  @Input() ships: ShipObject[] = [];
}
