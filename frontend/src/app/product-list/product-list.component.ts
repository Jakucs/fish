import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { FavouriteService } from '../shared/favourite.service';
import { UserapiService } from '../shared/userapi.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, TimeAgoPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

    favourited!: boolean; 
    message!: string;


  productList: any[] = []

  constructor(
    private productsapi: ProductapiService,
    private router: Router,
    private favouriteapi: FavouriteService,
    private userapi: UserapiService
  ) { }

ngOnInit() {
  if (this.userapi.isLoggedIn()) {
    this.productsapi.getProductsWithToken().subscribe({
      next: (data: any) => this.handleProducts(data),
      error: (error) => console.log("Hiba a termék betöltésekor: ", error)
    });
  } else {
    this.productsapi.getProductsPublic().subscribe({
      next: (data: any) => this.handleProducts(data),
      error: (error) => console.log("Hiba a termék betöltésekor: ", error)
    });
  }
}

handleProducts(data: any) {
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
}



    goToDetails(id: number) {
      this.router.navigate(['/product', id]);
    }

    toggleFavorite(product: any) {
      console.log('Kedvenc állapot váltva:', product);
      this.favouriteapi.toggleFavourite(product.id).subscribe({
        next: (res: any) => {
          console.log('Kedvenc állapot sikeresen megváltoztatva:', res);
            product.is_favourite = res.favourited;
        },
        error: (err) => {
          console.error('Hiba a kedvenc állapot megváltoztatásakor:', err);
        }
      })
    }
}
