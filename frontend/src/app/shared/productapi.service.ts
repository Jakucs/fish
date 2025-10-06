import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductapiService {

  private productItems: any[] = [];
  private productsURL = "http://192.168.100.147:8000/api"

  constructor(
    private http: HttpClient,
  ){}


  getProducts(){
    console.log(this.productsURL)
    return this.http.get(this.productsURL + '/products');
  }

  addProduct(productData: any){
    return this.http.post(this.productsURL + '/newproduct', productData);
  }
  
}
