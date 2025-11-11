import { Injectable } from '@angular/core';
import { UserapiService } from './userapi.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdapiService {

  private adList: any[] = [];
  myAdsURL = 'http://localhost:8000/api/getmyads'

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
