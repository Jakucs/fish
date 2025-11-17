import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthapiService } from './authapi.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserapiService {

   private userURL = environment.apiUrl;

  constructor(private http: HttpClient, private authapi: AuthapiService) { }

    makeHeader(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': 'Bearer ' + token }
    return header;
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.userURL}/userdetails`, { headers: this.makeHeader() });
  }

  getUserDetailsById(id: number): Observable<any> {
    return this.http.get(`${this.userURL}/userdetails/${id}`, { headers: this.makeHeader() });
  }
    
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Ellenőrizzük, hogy be vagyunk-e jelentkezve
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

    // Backendről kérdezzük le, hogy aktív-e a user
  isUserActive(): Observable<boolean> {
    return this.http
      .get(`${this.userURL}/userdetails`, { headers: this.authapi.makeHeader() })
      .pipe(
        map((res: any) => {
          const isActive = res?.data?.is_active === 1 || res?.data?.is_active === true;
          return isActive;
        }),
        catchError((err) => {
          console.error('Hiba az aktivitás lekérésekor:', err);
          return of(false); // ha hiba, kezeljük úgy, mintha inaktív lenne
        })
      );
  }



}
