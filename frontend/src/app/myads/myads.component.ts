import { Component } from '@angular/core';
import { AdapiService } from '../shared/adapi.service';
import { UserapiService } from '../shared/userapi.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DeleteProductComponent } from '../delete-product/delete-product.component';

@Component({
  selector: 'app-myads',
  imports: [CommonModule, DeleteProductComponent, RouterModule],
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

    goToAdupload() {
      this.router.navigate(['/ad_upload']);
    }

    goToModifyProduct(id: number) {
      this.router.navigate(['/modify-product', id]);
    }


}
