import { Component } from '@angular/core';
import { FavouriteService } from '../shared/favourite.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserapiService } from '../shared/userapi.service';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent {

    favourites: any[] = [];
    isLoading = true;
    errorMessage = '';

    constructor(
      private favouriteService: FavouriteService,
      private router: Router,
      public userapi: UserapiService
    ) { }

      ngOnInit(): void {
      this.loadFavourites();
    }

  loadFavourites(): void {
  this.favouriteService.getFavourites().subscribe({
    next: (res) => {
      const favourites = res.data || res;

      this.favourites = favourites.map((product: any) => {
        let firstImage = '';

        // Ha az image mező JSON string
        if (typeof product.image === 'string') {
          try {
            const parsed = JSON.parse(product.image);
            if (Array.isArray(parsed) && parsed.length > 0) {
              firstImage = parsed[0];
            } else {
              firstImage = product.image;
            }
          } catch {
            // nem JSON, sima string
            firstImage = product.image;
          }
        }
        // Ha már tömb
        else if (Array.isArray(product.image)) {
          firstImage = product.image[0];
        }

        return {
          ...product,
          firstImage,
        };
      });

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Hiba a kedvencek lekérésekor:', err);
      this.errorMessage = 'Nem sikerült betölteni a kedvenceket.';
      this.isLoading = false;
    },
  });
}

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  toggleFavourite(productId: number, event: MouseEvent): void {
  event.stopPropagation(); // ne nyissa meg a terméket

  this.favouriteService.toggleFavourite(productId).subscribe({
    next: (res) => {
      // ha eltávolítás történt, szűrjük ki a listából
      this.favourites = this.favourites.filter(p => p.id !== productId);
    },
    error: (err) => {
      console.error('Hiba a kedvenc eltávolításakor:', err);
    }
  });
}



  
}
