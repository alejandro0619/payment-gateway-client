import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateUser, SignInResponse, User } from '../auth.types';
import { environment } from '../../../envs/env.dev';
@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }



  signIn(identification: string, password: string): Observable<SignInResponse> {
    return this.http
      .post<SignInResponse>(`${this.API_URL}/auth/signin`, { identification, password })
      .pipe(
        map((response) => {
          // Puedes realizar alguna transformación en la respuesta si es necesario
          console.log('Inicio de sesión exitoso:', response);
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
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas'));
        } else {
          return throwError(() => new Error('Ocurrió un error inesperado'));
        }

       })

    );
  }
}
