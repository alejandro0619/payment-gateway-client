import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../envs/env.dev';

@Injectable({
  providedIn: 'root',
})
export class FirstRunGuard implements CanActivateChild {
  private API_URL = environment.BACKEND_URL;
  constructor(private router: Router, private http: HttpClient) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isFirstRunFalse = localStorage.getItem('first-run-false');
      console.log("ddasdad")
    // Si la bandera existe, permite el acceso a la ruta
    if (isFirstRunFalse) {
      return true;
    }

    // Si la bandera no existe, haz la petición al servidor para verificar si es el primer inicio
    return this.http.get<{
      isFirstRun: boolean;
    }>(`${this.API_URL}/auth/check-first-run`).pipe(
      tap((response) => {
        if (response.isFirstRun) {
          // Si es el primer inicio, redirige a /protected
          this.router.navigate(['/protected']);
        } else {
          // Si no es el primer inicio, establece la bandera en localStorage
          localStorage.setItem('first-run-false', 'true');
        }
      }),
      map((response) => {
        // Si es el primer inicio, no permitas el acceso a la ruta
        if (response.isFirstRun) {
          return false;
        }
        // Si no es el primer inicio, permite el acceso a la ruta
        return true;
      }),
      catchError((error) => {
        console.error('Error en /auth/check-first-run:', error);
        // En caso de error, permite el acceso a la ruta
        return of(true);
      })
    );
  }
}