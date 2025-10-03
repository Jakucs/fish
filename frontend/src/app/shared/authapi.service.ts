import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthapiService {

  private apiUrl = 'http://192.168.100.147:8000/api';

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserName() {
    return localStorage.getItem('userName') || '';
  }

  makeHeader() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token
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
}