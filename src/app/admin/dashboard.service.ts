// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../envs/env.dev';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_URL = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/course`);
  }
}