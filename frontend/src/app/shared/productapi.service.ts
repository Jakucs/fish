import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductapiService {

  private productItems: any[] = [];
  private productsURL = "http://localhost:8000/api/products"

  constructor(
    private http: HttpClient,
  ){}


  getProducts(){
    console.log(this.productsURL)
    return this.http.get(this.productsURL);
  }
  
}
