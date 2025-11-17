import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthapiService } from './authapi.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminapiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authapi: AuthapiService) {}

  // Felhasználók lekérése (csak adminoknak)
    getUsers(page: number = 1, search: string = ''): Observable<any> {
      const headers = this.authapi.makeHeader(); // marad a header

      // Paraméterek
      let params: any = { page };
      if (search) {
        params.search = search;
      }

      return this.http.get(`${this.baseUrl}/users`, { headers, params });
    }


    // Egy konkrét user részletes adatainak lekérése
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
