import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserapiService {

   private userURL = 'http://192.168.100.147:8000/api';

  constructor(private http: HttpClient) { }

    makeHeader(){
    const token = localStorage.getItem('token');
    const header = { 'Authorization': 'Bearer ' + token }
    return header;
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.userURL}/userdetails`, { headers: this.makeHeader() });
  }
}
