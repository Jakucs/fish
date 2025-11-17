import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private apiURL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userapi: UserapiService
  ) { }

  toggleFavourite(productId: number) {
    return this.http.post(`${this.apiURL}/favourites/toggle/${productId}`, {} , { headers: this.userapi.makeHeader() });
  }

    getFavourites(): Observable<any> {
    return this.http.get(this.apiURL + '/favourites', { headers: this.userapi.makeHeader() });
  }

}
