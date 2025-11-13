import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegistration } from '../models/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // URL base del backend - modificabile per ambiente prod
  private apiUrl = 'http://localhost:3000/api/registrations';

  constructor(private http: HttpClient) { }

  registerUser(userData: UserRegistration): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}