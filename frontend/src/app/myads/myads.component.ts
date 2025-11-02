import { Component } from '@angular/core';
import { AdapiService } from '../shared/adapi.service';
import { UserapiService } from '../shared/userapi.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InactiveGuardComponent } from '../inactive-guard/inactive-guard.component';

@Component({
  selector: 'app-myads',
  imports: [CommonModule, RouterModule, InactiveGuardComponent],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.css'
})
export class MyadsComponent {

  adList: any[] = [];
  isActiveUser: boolean | null = null;

  constructor(
    public userapi: UserapiService,
    private adapi: AdapiService,
    private router: Router
  ) { }


      ngOnInit() {
    // Először lekérdezzük a user státuszát
    this.userapi.isUserActive().subscribe({
      next: (isActive: boolean) => {
        if (isActive) {
          // 2️⃣ Ha aktív, betöltjük a hirdetéseket
          this.loadMyAds();
        } else {
          console.warn('A felhasználó fiókja inaktív, nem töltjük a hirdetéseket.');
        }
      },
      error: (err) => {
        console.error('Hiba az aktivitás lekérésekor:', err);
      }
    });
  }

    // A hirdetések betöltése külön metódusban
    loadMyAds() {
      this.adapi.getMyAds().subscribe({
        next: (data: any) => {
          this.adList = data.data.map((ad: any) => {
            let imagesArray: any[] = [];

            if (Array.isArray(ad.image)) {
              imagesArray = ad.image;
            } else if (typeof ad.image === 'string') {
              try {
                const parsed = JSON.parse(ad.image);
                imagesArray = Array.isArray(parsed) ? parsed : [parsed];
              } catch {
                imagesArray = [ad.image];
              }
            }

            return { ...ad, imagesArray };
          });

          console.log('MyAds tartalma képekkel: ', this.adList);
        },
        error: (error) => {
          console.error('Hiba a hirdetések betöltésekor: ', error);
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
