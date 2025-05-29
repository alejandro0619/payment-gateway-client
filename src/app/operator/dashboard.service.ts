import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../envs/env.dev';
import { Transaction } from '../global.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}


  findTransactions() {
    return this.http.get<Transaction[]>(`${this.API_URL}/transaction/operator`).pipe(
      catchError(this.handleError),
      
    )
  }
  
  setTransactionStatus(
    transactionId: string,
    status: 'completed' | 'rejected'
  ): Observable<Transaction> {
    const usr = localStorage.getItem('usr_info') || '{}';
    return this.http.patch<Transaction>(`${this.API_URL}/transaction`, { id: transactionId, status, validatedBy: usr }).pipe(
      catchError(this.handleError)
    );
  }

  getTransactionsHistory() {
    return this.http.get<Transaction[]>(`${this.API_URL}/transaction/operator-transactions-history`).pipe(
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
