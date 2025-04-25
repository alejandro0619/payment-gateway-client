import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';
import { Transaction } from '../../global.types';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_URL}/transaction`);
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/transaction/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  changeTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/transaction/${id}`, { status }).pipe(
      catchError(this.handleError)
    );
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

    return throwError(() => new Error(errorMessage));
  }
}