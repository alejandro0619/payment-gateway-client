import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { OnboardingComponent } from './auth/onboarding/onboarding.component';

export const routes: Routes = [
  {
    path: 'auth/login', component: LoginComponent
  },
  {
    path: 'auth/signup', component: SignupComponent
  },
  {
    path: 'auth/onboarding', component: OnboardingComponent
  }
];
