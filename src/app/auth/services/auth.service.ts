import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateUser, SignInResponse, User } from '../auth.types';
import { environment } from '../../../envs/env.dev';
import { Router } from '@angular/router';
import { Company } from '../../global.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.BACKEND_URL;
  private router = inject(Router);
  constructor(private http: HttpClient) {}

  redirectToLogin(reason?: string) {
    // puedes guardar un mensaje en el servicio o mostrar un toast
    this.router.navigate(['/auth/login']);
  }
  signIn(identification: string, password: string): Observable<SignInResponse> {
    return this.http
      .post<SignInResponse>(`${this.API_URL}/auth/signin`, {
        identification,
        password,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          if (response.user) {
            this.setCurrentUser(response.user);
          }

          this.getCompanyInfo().subscribe({
            next: () => { console.log('Información de la empresa obtenida correctamente', localStorage.getItem('company')); },
            error: (err) => {
              console.error(
                'Error al obtener la información de la empresa:',
                err
              );
            },
          });
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
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición de signup:', error);
        if (error.status === 401) {
          // This error is also triggered when the role the user is trying to register is not allowed on this endpoint, bu since the user should only register as USER through this endpoint, we can assume that the error is due to invalid credentials
          return throwError(
            () => new Error('El correo o la identificación ya están en uso')
          );
        } else {
          return throwError(() => new Error('Ocurrió un error inesperado'));
        }
      })
    );
  }

  signupAdmin(user: Partial<CreateUser>, fragment = 'signup-admin') {
    // TODO: ADD THE INTERCEPTOR TO THIS REQUEST, FN, IT IS HARDCODED
    return this.http.post(`${this.API_URL}/auth/${fragment}`, user).pipe(
      map((response) => {
        return response;
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
  getCompanyInfo() {
    return this.http.get<Company>(`${this.API_URL}/company`).pipe(
      map((resp: Company) =>
        
        localStorage.setItem('company', JSON.stringify(resp))
      ),
      catchError(this.handleError)
    );
  }

  signupOperator(id: string) {
    return this.http
      .patch(`${this.API_URL}/auth/signup-operator`, {
        id,
      })
      .pipe(
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
    return this.http.post<{ accessToken: string }>(
      `${this.API_URL}/auth/refresh-token`,
      {
        refreshToken,
      }
    );
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error';

    if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado para acceder a este recurso';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error('Error en la solicitud:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  logout() {
    console.log('Logging out...');
    return this.http.post(`${this.API_URL}/auth/logout`, {}).pipe(
      map((response) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('usr_info');
        localStorage.removeItem('company');
        this.router.navigate(['/auth/login']);
        return response;
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

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
}
