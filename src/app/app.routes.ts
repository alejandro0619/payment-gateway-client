import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupAdminComponent } from './auth/signup-admin/signup-admin.component';
import { SignupOperatorComponent } from './auth/signup-operator/signup-operator.component';

import { ProtectedComponent } from './protected/protected.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { DashboardComponent as UserDashboard } from './user/dashboard.component';
import { DashboardComponent as OperatorDashboard } from './operator/dashboard.component';
import { DashboardComponent as AdminDashboard } from './admin/dashboard.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { AuthGuard } from './auth/auth.guard';
import { FirstRunGuard } from '../core/guards/first-run.guard';
import { OperatorsComponent } from './admin/operators/operators.component';
import { PaymentRecordComponent } from './operator/payment-record.component';
import { PaymentRecordComponent as PaymentRecordComponentStudent } from './user/payment-record.component';
import { StepOneComponent } from './onboarding/step_one/step_one.component';
import { StepTwoComponent } from './onboarding/step_two/step_two.component';
import { SettingsComponent } from './admin/settings/settings.component';

export const routes: Routes = [
  {
    path: 'onboarding/step-one',
    component: StepOneComponent,
  },
  {
    path: 'onboarding/step-two',
    component: StepTwoComponent,
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
      {
        path: 'auth/login',
        component: LoginComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'auth/signup',
        component: SignupComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'auth/signup-admin',
        component: SignupAdminComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'auth/signup-operator',
        component: SignupOperatorComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'user/dashboard',
        component: UserDashboard,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'operator/dashboard',
        component: OperatorDashboard,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'operator/payment-record',
        component: PaymentRecordComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'user/payment-record',
        component: PaymentRecordComponentStudent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'admin/courses',
        component: CoursesComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'admin/employees',
        component: OperatorsComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'admin/transactions',
        component: TransactionsComponent,
        canActivate: [FirstRunGuard],
      },
      {
        path: 'admin/students',
        component: SettingsComponent,
        canActivate: [FirstRunGuard],
      },
    ],
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
