import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modify-product',
  imports: [],
  templateUrl: './modify-product.component.html',
  styleUrl: './modify-product.component.css'
})
export class ModifyProductComponent {

  productDetails: any;

  constructor(
    private productapi: ProductapiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // URL-ből az ID
    if (id) {
      this.getProductDetails(+id); // string → number
    }
  }

  getProductDetails(id: number) {
    this.productapi.getProduct(id).subscribe({
      next: (res) => {
        this.productDetails = res.data;
        console.log('Betöltött termék:', this.productDetails);
      },
      error: (err) => {
        console.error('Hiba a termék lekérésekor:', err);
      }
    });
  }

}
