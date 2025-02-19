import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupAdminComponent } from './auth/signup-admin/signup-admin.component';
import { OnboardingComponent } from './auth/onboarding/onboarding.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent as AdminDashboard } from './admin/dashboard.component';
import { DashboardComponent as UserDashboard } from './user/dashboard.component';
import { DashboardComponent as OperatorDashboard } from './operator/dashboard.component';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth/login', component: LoginComponent, canActivate: [AuthGuard]
  },
  {
    path: 'auth/signup', component: SignupComponent, canActivate: [AuthGuard]
  },
  {
    path: 'auth/onboarding', component: OnboardingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'auth/signup-admin', component: SignupAdminComponent, canActivate:[AuthGuard]
  },
  {
    path: 'user/dashboard', component: UserDashboard, //canActivate: [AuthGuard]
  },
  {
    path: 'operator/dashboard', component: OperatorDashboard, canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard', component: AdminDashboard, //canActivate: [AuthGuard]
  },
  

  // Protected routes
  {
    path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard]
  },


  // Public routes
  

  // Default redirect
  {
    path: "**", redirectTo: "auth/login"
  }
];
