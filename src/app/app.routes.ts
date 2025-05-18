import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupAdminComponent } from './auth/signup-admin/signup-admin.component';
import { SignupOperatorComponent } from './auth/signup-operator/signup-operator.component';
import { OnboardingComponent } from './auth/onboarding/onboarding.component';
import { ProtectedComponent } from './protected/protected.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { DashboardComponent as UserDashboard } from './user/dashboard.component';
import { DashboardComponent as OperatorDashboard } from './operator/dashboard.component';
import { DashboardComponent as AdminDashboard } from './admin/dashboard.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { AuthGuard } from './auth/auth.guard';
import { FirstRunGuard } from '../core/guards/first-run.guard';
import { OperatorsComponent } from './admin/operators/operators.component';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [FirstRunGuard], //  Apply FirstRunGuard to all child routes to prevent the access to auth/signup-admin if the application is not in first run.
    children: [
      {
        path: '',
        redirectTo: '/auth/login', 
        pathMatch: 'full',
      },
      // Auth routes
      {
        path: 'auth/login',
        component: LoginComponent,
      },
      {
        path: 'auth/signup',
        component: SignupComponent,
      },
      {
        path: 'auth/onboarding',
        component: OnboardingComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'auth/signup-admin',
        component: SignupAdminComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'user/dashboard',
        component: UserDashboard,
        // canActivate: [AuthGuard],
      },
      {
        path: 'operator/dashboard',
        component: OperatorDashboard,
        // canActivate: [AuthGuard],
      },
      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        //canActivate: [AuthGuard],
      },
      {
        path: 'admin/courses',
        component: CoursesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'admin/employees',
        component: OperatorsComponent,
      },
      {
        path: 'admin/transactions',
        component: TransactionsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'auth/signup-operator',
        component: SignupOperatorComponent,
        //canActivate: [AuthGuard],
      },
    ],
  },
  
      // Excluye la ruta /protected del FirstRunGuard
      {
        path: 'protected',
        component: ProtectedComponent,
        canActivate: [AuthGuard],
      },

      // Default redirect
      {
        path: '**',
        redirectTo: '/auth/login',
      },
];