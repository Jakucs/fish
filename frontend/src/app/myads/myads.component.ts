import { Component } from '@angular/core';
import { AdapiService } from '../shared/adapi.service';
import { UserapiService } from '../shared/userapi.service';

@Component({
  selector: 'app-myads',
  imports: [],
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
        console.log(data);
        this.adList = data.data;
        console.log("MyAds tartalma: ", this.adList)
      },
      error: (error) => {
        console.log("Hiba a hirdetések betöltésekor: ", error)
      }
    })
  }
}
