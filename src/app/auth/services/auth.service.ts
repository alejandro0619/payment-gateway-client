import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { LoginResponse } from '../auth.types';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  private API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }


  login(id: string, password: string): Observable<LoginResponse> {
    // return this.http.post<LoginResponse>('/api/login', { id, password });

    return of({
      status: 200,
      description: 'Login successful'
    }).pipe(delay(1000));

  }
}
