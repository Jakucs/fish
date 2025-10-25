import { Component } from '@angular/core';
import { AdapiService } from '../shared/adapi.service';
import { UserapiService } from '../shared/userapi.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-myads',
  imports: [CommonModule, RouterModule],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.css'
})
export class MyadsComponent {

  adList: any[] = []

  constructor(
    private userapi: UserapiService,
    private adapi: AdapiService,
    private router: Router
  ) { }


    ngOnInit() {
      this.adapi.getMyAds().subscribe({
        next: (data: any) => {
          this.adList = data.data.map((ad: any) => {
            let imagesArray: any[] = [];

            if (Array.isArray(ad.image)) {
              // Már tömb
              imagesArray = ad.image;
            } else if (typeof ad.image === 'string') {
              try {
                const parsed = JSON.parse(ad.image);
                imagesArray = Array.isArray(parsed) ? parsed : [parsed];
              } catch {
                // Nem JSON (pl. URL), kezeljük sima stringként
                imagesArray = [ad.image];
              }
            }

            return { ...ad, imagesArray };
          });

          console.log("MyAds tartalma képekkel: ", this.adList);
        },
        error: (error) => {
          console.log("Hiba a hirdetések betöltésekor: ", error);
        }
      });
    }


    goToAdupload() {
      this.router.navigate(['/ad_upload']);
    }

    goToModifyProduct(id: number) {
      this.router.navigate(['/modify-product', id]);
    }


}
