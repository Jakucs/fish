import { Component } from '@angular/core';
import { AdapiService } from '../shared/adapi.service';
import { UserapiService } from '../shared/userapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myads',
  imports: [CommonModule],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.css'
})
export class MyadsComponent {

  adList: any[] = []

  constructor(
    private userapi: UserapiService,
    private adapi: AdapiService,
  ) { }


    ngOnInit() {
      this.adapi.getMyAds().subscribe({
        next: (data: any) => {
          this.adList = data.data.map((ad: any) => {
            return {
              ...ad,
              imagesArray: ad.image ? JSON.parse(ad.image) : [] // JSON string → tömb
            };
          });

          console.log("MyAds tartalma képekkel: ", this.adList);
        },
        error: (error) => {
          console.log("Hiba a hirdetések betöltésekor: ", error)
        }
      });
    }


}
