import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  typesURL: string = "http://127.0.0.1:8000/api/types";

  constructor(private http: HttpClient) { }

  getTypes(){
    return this.http.get(this.typesURL);
  }

  getType(){
    return this.http.get(this.typesURL);
  }
}
