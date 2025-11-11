import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthapiService {
  private email: string = '';

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserName() {
    return localStorage.getItem('userName') || '';
  }

    makeHeader(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // ha null - üres string
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  logout() {
    const url = `${this.apiUrl}/logout`;
    return this.http.post(url, {}, { headers: this.makeHeader() });
  }

  register(data: any) {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, data);
  }

  login(data: any) {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, data);
  }

    setEmail(email: string) {
    this.email = email;
  }

    getEmail() {
    return this.email;
  }
}