import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  typesURL: string = "http://localhost:8000/api/types";

  constructor(private http: HttpClient) { }

  getTypes(){
    return this.http.get(this.typesURL);
  }

  getType(){
    return this.http.get(this.typesURL);
  }
}
