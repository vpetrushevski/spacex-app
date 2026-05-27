import { Component, Input } from '@angular/core';

import { CrewMemberObject } from '../../../../core/models/launch.model';

@Component({
  selector: 'app-crew-card',
  standalone: true,
  imports: [],
  templateUrl: './crew-card.html',
  styleUrl: './crew-card.scss'
})
export class CrewCard {

  /**
   * Inputs
   */
  @Input() crewMembers: CrewMemberObject[] = [];
}
