import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-product.component.html',
})
export class DeleteProductComponent {
  productId!: number;
  product: any = null; // 🔹 A törlendő termék adatai
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchProduct();
  }

  // 🔹 Lekérjük a termék adatait
  fetchProduct() {
    const url = `http://192.168.100.147:8000/api/product/${this.productId}`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.product = res.data ?? res; // backend szerkezetétől függően
        this.loading = false;
      },
      error: (err) => {
        console.error('Hiba a termék lekérésekor:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  // 🔹 Törlés megerősítése
  confirmDeletion() {
    const url = `http://192.168.100.147:8000/api/destroyproduct/${this.productId}`;
    const token = localStorage.getItem('token'); // vagy ahogy tárolod a JWT-t

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    this.http.delete(url, { headers }).subscribe({
      next: (res) => {
        console.log('Sikeresen törölve', res);
        this.router.navigate(['/my-products']);
      },
      error: (err) => {
        console.error('Hiba a törlés során', err);
        alert('Hiba történt a termék törlésekor.');
      },
    });
  }


  cancelDeletion() {
    this.router.navigate(['/my-products']);
  }



  isJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

getFirstImage(value: string): string {
  try {
    const images = JSON.parse(value);
    return Array.isArray(images) && images.length > 0 ? images[0] : '';
  } catch {
    return '';
  }
}
}
