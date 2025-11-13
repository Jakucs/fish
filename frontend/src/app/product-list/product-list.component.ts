import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { FavouriteService } from '../shared/favourite.service';
import { UserapiService } from '../shared/userapi.service';
import { TypesService } from '../shared/types.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll'; // <<< VÁLTOZÁS: infinite scroll modul import

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TimeAgoPipe,
    FormsModule,
    InfiniteScrollModule // <<< VÁLTOZÁS: standalone komponens imports-ban
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'] // <<< VÁLTOZÁS: javítva styleUrl -> styleUrls
})
export class ProductListComponent {

  searchQuery: string = '';
  productList: any[] = [];
  types: any[] = [];

  // <<< VÁLTOZÁS: infinite scroll állapotváltozók
  currentPage = 1; // aktuális oldal
  lastPage = 1;    // utolsó oldal
  perPage = 20;    // elemek száma oldalanként
  isLoading = false; // betöltés állapot

  constructor(
    private productsapi: ProductapiService,
    private router: Router,
    private favouriteapi: FavouriteService,
    public userapi: UserapiService,
    private typeapi: TypesService
  ) { }

  ngOnInit() {
    const savedScroll = sessionStorage.getItem('scrollY');
    if (savedScroll) {
      setTimeout(() => window.scrollTo(0, +savedScroll), 0);
      sessionStorage.removeItem('scrollY');
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        sessionStorage.setItem('scrollY', window.scrollY.toString());
      });

    this.loadProducts(); // <<< VÁLTOZÁS: oldal betöltés az infinite scroll támogatás miatt
    this.loadTypes();
  }

  // <<< VÁLTOZÁS: oldal alapú betöltés
  loadProducts(page: number = 1) {
    if (this.isLoading) return; // <<< VÁLTOZÁS: prevent double load
    this.isLoading = true;

    const request$ = this.userapi.isLoggedIn() && this.userapi.isUserActive()
      ? this.productsapi.getProductsWithToken()
      : this.productsapi.getProductsPublic();

    request$.subscribe({
      next: (data: any) => {
        if (page === 1) this.productList = []; // <<< VÁLTOZÁS: ha új keresés/first page, ürítjük a listát
        this.handleProducts(data, page);       // <<< VÁLTOZÁS: most page-t is átadjuk
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // <<< VÁLTOZÁS: oldalankénti termék hozzáadás
  handleProducts(data: any, page: number) {
    const newProducts = data.data.map((product: any) => {
      let imagesArray: string[] = [];

      if (product.image) {
        try {
          const parsed = JSON.parse(product.image);
          imagesArray = Array.isArray(parsed) ? parsed : [product.image];
        } catch {
          imagesArray = [product.image];
        }
      }

      return { ...product, imagesArray };
    });

    if (page === 1) {
      this.productList = newProducts; // <<< VÁLTOZÁS: első oldal
    } else {
      this.productList = [...this.productList, ...newProducts]; // <<< VÁLTOZÁS: többi oldal hozzáfűzése
    }

    this.currentPage = data.current_page || page; // <<< VÁLTOZÁS: oldalszám frissítése
    this.lastPage = data.last_page || 1;          // <<< VÁLTOZÁS: utolsó oldal frissítése
  }

  // <<< VÁLTOZÁS: infinite scroll trigger
  onScrollDown() {
    if (this.currentPage < this.lastPage) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  goToDetails(id: number) {
    this.router.navigate(['/product', id]);
  }

  toggleFavorite(product: any) {
    this.favouriteapi.toggleFavourite(product.id).subscribe({
      next: (res: any) => product.is_favourite = res.favourited,
      error: err => console.error(err)
    });
  }

  getProductsByType(typeId: number) {
    this.productsapi.getProductsByType(typeId).subscribe({
      next: (data: any) => this.handleProducts(data, 1), // <<< VÁLTOZÁS: új filter esetén mindig 1. oldal
      error: err => console.error(err)
    });
  }

  onSearchChange() {
    const q = this.searchQuery.trim();
    if (q.length >= 2) {
      this.productsapi.searchProducts(q).subscribe({
        next: (res: any) => this.handleProducts({ data: res }, 1), // <<< VÁLTOZÁS: keresés is 1. oldal
        error: err => console.error(err)
      });
    } else {
      this.loadProducts(1); // <<< VÁLTOZÁS: ha törli a keresést, újratöltés 1. oldaltól
    }
  }

  loadTypes(): void {
    this.typeapi.getTypes().subscribe({
      next: (res: any) => this.types = res.data || res,
      error: err => console.error(err)
    });
  }
}
