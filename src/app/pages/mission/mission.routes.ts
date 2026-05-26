import { Routes } from '@angular/router';

import { Mission } from './mission';

export const MISSION_ROUTES: Routes = [
  {
    path: '',
    component: Mission,
    children: [
      {
        path: 'latest',
        loadComponent: () => import('./latest-mission/latest-mission').then(m => m.LatestMission)
      },
      {
        path: ':type',
        loadComponent: () => import('./mission-table/mission-table').then(c => c.MissionTable)
      },
      {
        path: '**',
        redirectTo: 'latest'
      }
    ]
  }
];
