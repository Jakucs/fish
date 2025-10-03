import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {


    productList: any[] = []

  constructor(private productsapi: ProductapiService) { }

  ngOnInit() {
    this.productsapi.getProducts().subscribe({
      next: (data:any) => {
        console.log(data);
        this.productList = data.data;
        console.log("ProductList tartalma: ", this.productList)
      },
      error: (error) => {
        console.log("Hiba a termék betöltésekor: ", error)
      }
    });
  }
}
