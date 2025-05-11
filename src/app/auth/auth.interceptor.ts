import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicEndpoints = ['/auth/login', '/auth/signup', '/', '/auth/forgot-password', '/auth/signin'];

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Interceptando la petición:', request);

    if (accessToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }
          return throwError(() => error);
        })
      );
    } else {

      if (this.isPublicRequest(request)) { 
        return next.handle(request);
      } else {
        this.router.navigate(['/auth/login']);
        return throwError(() => new Error('Acceso no autorizado'));
      }
    }
  }

  private isPublicRequest(request: HttpRequest<unknown>): boolean {
    const url = new URL(request.url);
    return this.publicEndpoints.some(endpoint => 
      url.pathname.endsWith(endpoint) || 
      request.url.endsWith(endpoint)
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((response: { accessToken: string }) => {
          localStorage.setItem('accessToken', response.accessToken);
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });
          return next.handle(clonedRequest);
        }),
        catchError((error) => {
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
    } else {
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Sesión expirada'));
    }
  }
}