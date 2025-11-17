import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TypesService {

  typesURL: string = `${environment.apiUrl}/types`;

  constructor(private http: HttpClient) { }

  getTypes(){
    return this.http.get(this.typesURL);
  }

  getType(){
    return this.http.get(this.typesURL);
  }
}
