import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../envs/env.dev';
import { HttpClient } from '@angular/common/http';
export interface Company {
  name: string;
  address: string;
  telephone_number?: string;
  email?: string;
  description?: string;
  image?: string; // Base64 string
  payment_preference?: 'paypal' | 'zelle' | 'both';
}

@Injectable({
  providedIn: 'root'
})
export class StepTwoService {
  private BACKEND_URL = `${environment.BACKEND_URL}/auth/create-company`;
  constructor(private http: HttpClient) { }

  createCompany(data: Company): Observable<any> {
    return this.http.post(this.BACKEND_URL, data);
  }
}