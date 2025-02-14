import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { OnboardingComponent } from './auth/onboarding/onboarding.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'auth/signup', component: SignupComponent
  },
  {
    path: 'auth/onboarding', component: OnboardingComponent
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
