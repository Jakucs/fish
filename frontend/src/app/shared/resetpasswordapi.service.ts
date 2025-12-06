import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordapiService {

  apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  resetPassword(email: string, token: string, password: string) {
  return this.http.post(`${this.apiURL}/reset-password`, {
    email: email,
    token: token,
    password: password,
    password_confirmation: password
  });
}

}
