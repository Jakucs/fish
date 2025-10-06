import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {


  productList: any[] = []

  constructor(private productsapi: ProductapiService) { }

    ngOnInit() {
      this.productsapi.getProducts().subscribe({
        next: (data: any) => {   // <-- itt deklaráljuk a data változót
          console.log(data);

          this.productList = data.data.map((product: any) => {
            let imagesArray: string[] = [];

            if (product.image) {
              try {
                const parsed = JSON.parse(product.image);
                imagesArray = Array.isArray(parsed) ? parsed : [product.image];
              } catch {
                imagesArray = [product.image];
              }
            }

            return {
              ...product,
              imagesArray
            };
          });
        },
        error: (error) => {
          console.log("Hiba a termék betöltésekor: ", error);
        }
      });
    }


}
