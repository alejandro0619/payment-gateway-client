import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';

export interface GenerateOTPResponse {
  code: string;
  userId: string;
  email: string;
  OTPcreatedAt: Date;
}
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordsService {
  constructor(private http: HttpClient) { }
  BACKEND_URL = environment.BACKEND_URL;
  /**
   * Solicita un código de un solo uso (OTP) para restablecer la contraseña del usuario.
   * @param id - Número de identificación del usuario.
   * @returns Un observable que emite la respuesta del servidor con el código OTP.
   */
  requestPasswordReset(id: string): Observable<GenerateOTPResponse> {
    return this.http.post<GenerateOTPResponse>(`${this.BACKEND_URL}/one-time-password/generate`, { identificationNumber: id }).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * Verifica el código OTP proporcionado por el usuario.
   * @param otp - Código OTP ingresado por el usuario.
   * @returns Un observable que emite un booleano indicando si la verificación fue exitosa.
   */
  validateOTP(otp: number, id: string, newPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.BACKEND_URL}/one-time-password/validate`, {
      identificationNumber: id, code: otp, password: newPassword

    }).pipe(
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
  resetPassword(token: string, newPassword: string): Observable<boolean> {
    // Mock implementation: always succeeds
    return of(true);
  }
}