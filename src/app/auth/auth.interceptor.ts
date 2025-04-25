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
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('Interceptando la solicitud HTTP:', request);
    const accessToken = localStorage.getItem('accessToken');


      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // If the error is 401, try to refresh the token
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }
          return throwError(() => error);
        })
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
      return throwError(() => new Error('No autorizado'));
    }
  }
}