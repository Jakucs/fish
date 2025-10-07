import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductapiService {

  productsURL = "http://192.168.100.147:8000/api"

  constructor(
    private http: HttpClient,
    private userapi: UserapiService
  ){}


  getProducts(){
    console.log(this.productsURL)
    return this.http.get(this.productsURL + '/products');
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.productsURL}/product/${id}`);
  }


  addProduct(productData: any){
    const headers = this.userapi.makeHeader();
    return this.http.post(this.productsURL + '/newproduct', productData, { headers } );
  }

  updateProductImage(productId: number, imageUrl: string) {
  const headers = this.userapi.makeHeader();
  return this.http.patch(`${this.productsURL}/update/${productId}`, { image: imageUrl }, { headers });
}

  
}