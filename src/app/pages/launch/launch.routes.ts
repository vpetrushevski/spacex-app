import { Routes } from '@angular/router';

import { Launch } from './launch'

export const LAUNCH_ROUTES: Routes = [
  {
    path: '',
    component: Launch,
    children: [
      {
        path: 'latest',
        loadComponent: () => import('./latest-launch/latest-launch').then(c => c.LatestMission)
      },
      {
        path: 'details',
        loadComponent: () => import('./launch-details/launch-details').then(c => c.LaunchDetails)
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
