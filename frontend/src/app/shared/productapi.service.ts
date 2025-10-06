import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';

@Injectable({
  providedIn: 'root'
})
export class ProductapiService {

  private productsURL = "http://192.168.100.147:8000/api"

  constructor(
    private http: HttpClient,
    private userapi: UserapiService
  ){}


  getProducts(){
    console.log(this.productsURL)
    return this.http.get(this.productsURL + '/products');
  }

  addProduct(productData: any){
    const headers = this.userapi.makeHeader();
    return this.http.post(this.productsURL + '/newproduct', productData, { headers } );
  }
  
}
