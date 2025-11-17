import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdapiService {

  private adList: any[] = [];
  myAdsURL = `${environment.apiUrl}/getmyads`;

  constructor(
    private userapi: UserapiService,
    private http: HttpClient
  ) { }


  getAds(): any {
    return this.adList;
  }

  addAd(ad: any){
    this.adList.push(ad);
  }

  getMyAds(){
      const headers = this.userapi.makeHeader();
      return this.http.get(this.myAdsURL, { headers } );
  }
}
