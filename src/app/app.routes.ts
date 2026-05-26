import { Routes } from '@angular/router';

import { LoginGuard } from './core/guards/login.guard';
import { AuthGuardService } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [LoginGuard]
  },
  {
    path: 'missions',
    loadChildren: () =>
      import('./pages/mission/mission.routes').then(m => m.MISSION_ROUTES),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
