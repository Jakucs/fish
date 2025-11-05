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


    getProductsWithToken() {
    const token = this.userapi.getToken();
    return this.http.get(this.productsURL + '/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getProductsPublic() {
    return this.http.get(this.productsURL + '/products/public');
  }


  //Mindent releváns adatot lekérünk egy termékről ID alapján és megis kapjuk, user táblából a phone_number-t, locations táblából a várost irányítószámmal együtt
  //De végül nem használjuk fel, mert külön api hívásként kezeljük a user adatokat
  getProduct(id: string | number): Observable<any> {
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

  getProductsByType(id: number){
    return this.http.get(`${this.productsURL}/getproductsbytype/${id}`);
  }

  modifyProduct(productId: number, productData: any) {
    const headers = this.userapi.makeHeader();
    return this.http.put(`${this.productsURL}/updateproduct/${productId}`, productData, { headers });
  }

  searchProducts(query: string) {
  return this.http.get(`${this.productsURL}/products/search`, {
    params: { q: query }
  });
  }


  //Képek végpontjaival a kommunikáció
  getPictures(productId: number){
    const headers = this.userapi.makeHeader();
    return this.http.get(`${this.productsURL}/pictures/${productId}`, {headers});
  }

  newPicture(id: number, images: string[]) {
  return this.http.post<{ image: string[] }>(`${this.productsURL}/newpicture`, {
    product_id: id,
    images
  });
}

  destroyPicture(id: number, url: string) {
    return this.http.request<{ image: string[] }>('delete', `${this.productsURL}/destroypicture/${id}`, {
      body: { url }
    });
  }

  updatePicture(id: number, index: number, newUrl: string) {
    return this.http.put<{ image: string[] }>(`${this.productsURL}/updatepicture/${id}`, {
      index,
      new_url: newUrl
    });
  }

  newPictureWithPublicId(id: number, images: { url: string; public_id: string }[]) {
  return this.http.post<{ image: string[] }>(
    `${this.productsURL}/newpicture-publicid`,
    {
      product_id: id,
      images
    }
  );
}


  
}