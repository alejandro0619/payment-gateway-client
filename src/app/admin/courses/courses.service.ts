// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../envs/env.dev';
import { Course } from '../../global.types';

interface UpdateCourse {
  name?: string;
  description?: string;
  price?: string;
  image?: string | null;
}

interface DeleteResponse {
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<any[]>(`${this.API_URL}/course`);
  }

  getCoursesByid(id: string): Observable<Course> {
    return this.http.get<any>(`${this.API_URL}/course/${id}`).pipe(
      catchError(this.handleError)
    );
  }

    updateCourse(id: string, updateData: UpdateCourse): Observable<Course> {
      return this.http.patch<Course>(`${this.API_URL}/${id}`, updateData).pipe(
        catchError(this.handleError)
      );
    }
  
    deleteCourse(id: string): Observable<DeleteResponse> {
      return this.http.delete<DeleteResponse>(`${this.API_URL}/${id}`).pipe(
        catchError(this.handleError)
      );
    }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error';
    
    if (error.status === 404) {
      errorMessage = 'Curso no encontrado';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado para acceder a este recurso';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}