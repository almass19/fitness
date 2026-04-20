import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}

  profile() {
    return this.http.get(`${this.baseUrl}/profile/`);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/profile/update/`, data);
  }
  classes() {
    return this.http.get('http://127.0.0.1:8000/api/classes/');
  }
  generateWorkout(data: any) {
    return this.http.post(`http://127.0.0.1:8000/api/generate-workout/`, data);
  }
}