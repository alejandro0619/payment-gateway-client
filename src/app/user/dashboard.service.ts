import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../envs/env.dev';
import { Course, CreateTRXResponse } from '../global.types';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }



  createTransaction(courseId: string, userId: string, paymentMethod: 'paypal' | 'zelle'
  ): Observable<any> {
    return this.http.post<CreateTRXResponse>(`${this.API_URL}/transaction`, {
      courseId,
      userId,
      paymentMethod
    }).pipe(
      catchError(this.handleError)
    );

  }

  createOrder(transactionId: string) {
    return this.http.post(`${this.API_URL}/transaction/order`, {
      transactionId,
    })
      .pipe(
        catchError(this.handleError)
      );
  }
  getCourses(): Observable<any[]> {
    return this.http.get<Course[]>(`${this.API_URL}/course`).pipe(
      catchError(this.handleError)
    );
  }

  autorizePayment(trxId: string, status: string) {
    return this.http.patch(`${this.API_URL}/transaction`, {
      id: trxId,
      status,
    })
      .pipe(
        catchError(this.handleError)
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

}
