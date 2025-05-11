import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateUser, SignInResponse, User } from '../auth.types';
import { environment } from '../../../envs/env.dev';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  private API_URL = environment.BACKEND_URL;
  private router = inject(Router);
  constructor(private http: HttpClient) { }



  signIn(identification: string, password: string): Observable<SignInResponse> {
    return this.http
      .post<SignInResponse>(`${this.API_URL}/auth/signin`, { identification, password })
      .pipe(
        map((response) => {

          localStorage.setItem('accessToken', response.accessToken);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Error 401: Credenciales inválidas');
            return throwError(() => new Error('Credenciales inválidas'));
          } else {
            console.error('Error inesperado:', error.message);
            return throwError(() => new Error('Ocurrió un error inesperado'));
          }
        })
      );
  }

  signup(user: Partial<CreateUser>) {
    return this.http.post(`${this.API_URL}/auth/signup`, user).pipe(
      map((response) => {
        
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición de signup:', error); 
        if (error.status === 401) {
          // This error is also triggered when the role the user is trying to register is not allowed on this endpoint, bu since the user should only register as USER through this endpoint, we can assume that the error is due to invalid credentials
          return throwError(() => new Error('El correo o la identificación ya están en uso'));
        } else {
          return throwError(() => new Error('Ocurrió un error inesperado'));
        }

       })

    );
  }


  signupAdmin(user: Partial<CreateUser>) {  
    // TODO: ADD THE INTERCEPTOR TO THIS REQUEST, FN, IT IS HARDCODED 
    return this.http.post(`${this.API_URL}/auth/signup-admin`, user, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).pipe(
      map((response) => {
        return response
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas'));
        } else {
          return throwError(() => new Error('Ocurrió un error inesperado'));
        }

      })

    );
  }

  signupOperator(id: string) {
    return this.http.patch(`${this.API_URL}/auth/signup-operator`, {
      id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas'));
        } else {
          return throwError(() => new Error('Ocurrió un error inesperadito'));
        }
      })
    );
  }
  

  refreshToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.API_URL}/auth/refresh-token`, {
      refreshToken,
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/signin']);
  }
}
