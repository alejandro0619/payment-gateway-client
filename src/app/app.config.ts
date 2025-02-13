import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),provideToastr({
    preventDuplicates: true,
    resetTimeoutOnDuplicate: true,
    timeOut: 5000, 
    positionClass: 'toast-top-right', 
    closeButton: true, 
    progressBar: true,
  }),
    provideAnimations()]
};
