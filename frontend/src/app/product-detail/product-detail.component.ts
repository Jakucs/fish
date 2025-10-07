import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

  productDetails: any; // egy termék objektum, nem tömb

  constructor(
    private productapi: ProductapiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); // az URL-ből
    if (productId) {
      this.productapi.getProduct(productId).subscribe({
        next: (res: any) => {
          console.log("Product details fetched successfully");
          this.productDetails = res.data;
          console.log("productDetails tartalma: ", this.productDetails);
        },
        error: (err: any) => {
          console.log("Error fetching product details: ", err);
        }
      });
    }
  }


}
