import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductapiService {

  private productItems: any[] = [];
  private productsURL = "http://192.168.100.147:8000/api/products"

  constructor(
    private http: HttpClient,
  ){}


  getProducts(){
    console.log(this.productsURL)
    return this.http.get(this.productsURL);
  }

  addProduct(){
    //return this.http.post(this.productsURL,);
  }
  
}
