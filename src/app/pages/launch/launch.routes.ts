import { Routes } from '@angular/router';

import { Launch } from './launch'

export const LAUNCH_ROUTES: Routes = [
  {
    path: '',
    component: Launch,
    children: [
      {
        path: 'latest',
        loadComponent: () => import('./latest-launch/latest-launch').then(m => m.LatestMission)
      },
      {
        path: ':type',
        loadComponent: () => import('./launch-table/launch-table').then(c => c.MissionTable)
      },
      {
        path: '**',
        redirectTo: 'latest'
      }
    ]
  }
];
