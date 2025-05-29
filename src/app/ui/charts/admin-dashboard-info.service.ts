import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';

export interface TrxDashboard {
  id: string;
  amount: number;
  createdAt: string;
}
export interface PaymentMethod {
  name: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardInfoService {
  private BACKEND_URL = environment.BACKEND_URL;
  constructor(private http: HttpClient) { }

  getDashboardInfo(): Observable<TrxDashboard[]> {
    return this.http.get<TrxDashboard[]>(`${this.BACKEND_URL}/transaction/dashboard-transactions`).pipe(
      catchError(this.handleError)
    )
  }
  getPaymentMethodInfo(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.BACKEND_URL}/transaction/payment-method-percentage`).pipe(
      catchError(this.handleError)
    )
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