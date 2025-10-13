import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private userURL = 'http://192.168.100.147:8000/api';

  constructor(
    private http: HttpClient,
    private userapi: UserapiService
  ) { }

  toggleFavourite(productId: number) {
    return this.http.post(`${this.userURL}/favourites/toggle/${productId}`, {} , { headers: this.userapi.makeHeader() });
  }

}
