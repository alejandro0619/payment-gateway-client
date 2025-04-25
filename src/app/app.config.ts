import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'
import { AuthInterceptor } from './auth/auth.interceptor';

import { AuthGuard } from './auth/auth.guard';
import { FirstRunGuard } from '../core/guards/first-run.guard';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    provideToastr({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    }),
    AuthGuard,
    FirstRunGuard,
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true,
    },
    
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};