import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-detail',
  imports: [RouterModule, CommonModule, NgbPopoverModule],
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
  const productId = this.route.snapshot.paramMap.get('id');
  if (productId) {
    this.productapi.getProduct(productId).subscribe({
      next: (res: any) => {
        this.productDetails = res.data;
        console.log(this.productDetails);
        // Image mező normalizálása: mindig tömb
        if (this.productDetails.image) {
          try {
            const parsed = JSON.parse(this.productDetails.image);
            if (Array.isArray(parsed)) {
              this.productDetails.imagesArray = parsed;
            } else {
              this.productDetails.imagesArray = [this.productDetails.image];
            }
          } catch {
            // Nem JSON, sima string
            this.productDetails.imagesArray = [this.productDetails.image];
          }
        } else {
          this.productDetails.imagesArray = [];
        }

      },
      error: (err: any) => {
        console.log("Error fetching product details: ", err);
      }
    });
  }
}

showPhoneNumber() {
  alert(this.productDetails.user.phone_number);
}





}
