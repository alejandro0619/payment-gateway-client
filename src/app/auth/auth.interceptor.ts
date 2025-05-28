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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicEndpoints = [
    '/auth/login',
    '/auth/signup',
    '/',
    '/auth/forgot-password',
    '/auth/signin',
    '/auth/first-signup',
    '/auth/check-first-run',
    '/auth/signup-admin',
    '/auth/signup-operator'
  ];

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Token actual:', accessToken);
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
        this.authService.redirectToLogin('Acceso no autorizado');
        return throwError(() => new Error('Acceso no autorizado'));
      }
    }
  }

  private isPublicRequest(request: HttpRequest<unknown>): boolean {
    try {
      const url = new URL(request.url);
      return this.publicEndpoints.some(endpoint =>
        url.pathname.endsWith(endpoint) || request.url.endsWith(endpoint)
      );
    } catch {

      return this.publicEndpoints.some(endpoint => request.url.endsWith(endpoint));
    }
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
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
          this.authService.redirectToLogin('Token inválido');
          return throwError(() => error);
        })
      );
    } else {
      this.authService.redirectToLogin('Sesión expirada');
      return throwError(() => new Error('Sesión expirada'));
    }
  }
}
