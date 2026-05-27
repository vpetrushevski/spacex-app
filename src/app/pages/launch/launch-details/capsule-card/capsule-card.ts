import { Component, Input } from '@angular/core';

import { CapsuleObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-capsule-card',
  imports: [],
  templateUrl: './capsule-card.html',
  styleUrl: './capsule-card.scss'
})
export class CapsuleCard {

  /**
   * Inputs
   */
  @Input() capsules: CapsuleObject[] = [];
}
