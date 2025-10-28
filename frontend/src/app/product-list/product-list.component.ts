import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { FavouriteService } from '../shared/favourite.service';
import { UserapiService } from '../shared/userapi.service';
import { TypesService } from '../shared/types.service';

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
  types: any[] = [];
  productsByType: any[] = [];

  constructor(
    private productsapi: ProductapiService,
    private router: Router,
    private favouriteapi: FavouriteService,
    public userapi: UserapiService,
    private typeapi: TypesService
  ) { }

    ngOnInit() {
      this.loadProducts();
      this.loadTypes();
    }

    loadProducts(){
            if (this.userapi.isLoggedIn() && this.userapi.isUserActive()) {
        this.productsapi.getProductsWithToken().subscribe({
          next: (data: any) => {
            console.log("Bejelentkezett felhasználó termékei:", data);
            this.handleProducts(data);
          },
          error: (error) => console.log("Hiba a termék betöltésekor: ", error)
        });
      } else {
        this.productsapi.getProductsPublic().subscribe({
          next: (data: any) => {
            console.log("Publikus terméklista:", data);
            this.handleProducts(data);
          },
          error: (error) => console.log("Hiba a termék betöltésekor: ", error)
        });
      }
    }


      loadTypes(): void {
      this.typeapi.getTypes().subscribe({
        next: (res: any) => {
          this.types = res.data || res;
          console.log('Típusok:', this.types);
        },
        error: (err) => {
          console.error('Hiba a típusok lekérésekor:', err);
        }
      });
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

    getProductsByType(typeId: number) {
      this.productsapi.getProductsByType(typeId).subscribe({
        next: (data: any) => {
          this.handleProducts(data); // 🔹 így lesz imagesArray
          console.log("Termékek típussal: ", this.productList);
        },
        error: (error) => console.log("Hiba a termékek lekérésekor típussal: ", error)
      });
    }





}
