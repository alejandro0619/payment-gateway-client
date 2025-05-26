import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../envs/env.dev';

@Injectable({
  providedIn: 'root',
})
export class FirstRunGuard implements CanActivate {
  private API_URL = environment.BACKEND_URL;

  constructor(private router: Router, private http: HttpClient) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    const isFirstRunFalse = localStorage.getItem('first-run-false');

    if (isFirstRunFalse === 'true') {
      // Ya pasó onboarding → permitir acceso
      return true;
    }

    // Consultar backend para ver si es primer inicio
    return this.http
      .get<{ isFirstRun: boolean }>(`${this.API_URL}/auth/check-first-run`)
      .pipe(
        map((response) => {
          if (response.isFirstRun) {
            // Redirigir a onboarding si es primera ejecución
            return this.router.parseUrl('/onboarding/step-one');
          } else {
            localStorage.setItem('first-run-false', 'true');
            return true;
          }
        }),
        catchError((error) => {
          console.error('Error en /auth/check-first-run:', error);
          return of(true); // fallback seguro
        })
      );
  }
}
