import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthapiService } from './authapi.service';

@Injectable({
  providedIn: 'root'
})
export class AdminapiService {

    private baseUrl = 'http://192.168.100.147:8000/api'; // alap URL

  constructor(private http: HttpClient, private authapi: AuthapiService) {}

  // 🔹 Felhasználók lekérése (csak adminoknak)
      getUsers(page = 1): Observable<any> {
    const headers = this.authapi.makeHeader(); // mindig HttpHeaders
    return this.http.get(`${this.baseUrl}/users?page=${page}`, { headers });
    }

    // 🔹 Egy konkrét user részletes adatainak lekérése
      getUserDetails(id: number): Observable<any> {
        const headers = this.authapi.makeHeader();
        return this.http.get(`${this.baseUrl}/userdetails/${id}`, { headers });
      }

      toggleUserActive(userId: number) {
      const headers = this.authapi.makeHeader();
      return this.http.put(`${this.baseUrl}/users/${userId}/toggle-active`, {}, { headers });
    }

      toggleAdmin(userId: number){
      const headers = this.authapi.makeHeader();
      return this.http.put(`${this.baseUrl}/users/${userId}/toggle-admin-role`, {}, { headers });
      }

      getCurrentUser(): Observable<any> {
      const headers = this.authapi.makeHeader();
      return this.http.get(`${this.baseUrl}/user`, { headers });
    }


}
