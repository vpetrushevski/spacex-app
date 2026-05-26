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
    path: 'launches',
    loadChildren: () =>
      import('./pages/launch/launch.routes').then(m => m.LAUNCH_ROUTES),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
