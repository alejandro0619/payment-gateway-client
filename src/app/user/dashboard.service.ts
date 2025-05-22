import {  Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../envs/env.dev';
import { Company, Course, CreateTRXResponse, UserBalance, UserCoursesFeed } from '../global.types';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }


  getUserBalance(userId: string): Observable<any> {
    return this.http.get<UserBalance>(`${this.API_URL}/user/balance/${userId}/`).pipe(
      catchError(this.handleError)
    );
  }
  createTransaction(courseId: string, userId: string, paymentMethod: 'paypal' | 'zelle' | null = null
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


getUserCoursesFeed(userId: string): Observable<UserCoursesFeed> {
  const statuses = ['acquired', 'not_acquired', 'cancelled', 'expired', 'not_bought'];


  const requests = statuses.map(status => 
    this.http.post<Course[]>(`${this.API_URL}/user-course/get-user-courses-by-status`, {
      userId,
      status 
    }).pipe(
      tap(courses => console.log(`Cursos con estado ${status}:`, courses)),
      catchError(this.handleError),
      map(courses => ({ [status]: courses }))
    )
  );


  // Combinar todas las solicitudes y mapear a un objeto único
  return forkJoin(requests).pipe(
    // Reducir el array de objetos a un solo objeto
    map(results => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}))
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

  getCompanyEmail() {
    return this.http.get<Company[]>(`${this.API_URL}/company`)
      .pipe(
        map((resp: Company[]) => resp[0]?.email || null),
        catchError(this.handleError)
      );
  }
  sendConfirmation(trx: string, confirmation: string) {
    return this.http.patch(`${this.API_URL}/transaction/reference`, {
      id: trx,
      reference: confirmation
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
