import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { LoginResponse, UserPayload } from '../auth.types';

@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  private API_URL = process.env['BACKEND_URL'] || 'http://localhost:3000';
  constructor(private http: HttpClient) { }


  login(identification: string, password: string): Observable<LoginResponse> {
    this.http.post(`${this.API_URL}/auth/signin`, { identification, password });

    return of({
      status: 200,
      description: 'Login successful'
    }).pipe(delay(1000));

  }

  signup(user: UserPayload) {
    return this.http.post(`${this.API_URL}/auth/singup`, user);
  }
}
