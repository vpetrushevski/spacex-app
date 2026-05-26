import { Routes } from '@angular/router';

import { Auth } from './auth';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register').then(m => m.Register)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login').then(m => m.Login)
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./verify-account/verify-account').then(m => m.VerifyAccount)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./reset-password/reset-password').then(m => m.ResetPassword)
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
];
