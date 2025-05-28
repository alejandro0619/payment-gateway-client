import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';
import { User } from '../../global.types';
import { AuthService } from '../../auth/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient, private authService : AuthService) {}
  getUsers(): Observable<any[]> {
    return this.http
      .get<User[]>(`${this.API_URL}/user/role/user`)
      .pipe(catchError(this.handleError));
  }

  updateUser(user: Partial<User>): Observable<any> {
    console.log('Updating userrr:', user);
    return this.http
      .patch<User>(`${this.API_URL}/user/update/${user.id}`, user)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error';

    if (error.status === 404) {
      errorMessage = 'Transacción no encontrada';
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
}
