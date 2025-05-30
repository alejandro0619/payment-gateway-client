import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';
import { Company, User } from '../../global.types';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }
  getAdmins(): Observable<any[]> {
    return this.http
      .get<User[]>(`${this.API_URL}/user/role/admin`)
      .pipe(catchError(this.handleError));
  }

  updateAdmin(admin: Partial<User>): Observable<any> {
    console.log('Updating admin:', admin);
    return this.http
      .patch<User>(`${this.API_URL}/user/update/${admin.id}`, admin)
      .pipe(catchError(this.handleError));
  }
  modifyCompany(data: Company): Observable<any> {
    return this.http.put(`${this.API_URL}/company/update`, data);
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
