import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  imports: [CommonModule, RouterModule]
})
export class DeleteProductComponent {
  @Input() productId!: number; // a törlendő termék ID-je
  confirmationVisible = false; // megerősítő ablak láthatósága

  constructor(private http: HttpClient, private router: Router) {}

  // 1️⃣ gomb megnyomásakor csak a confirmation-t mutatjuk
  deleteProduct() {
    this.confirmationVisible = true;
  }

  // 2️⃣ ha a felhasználó mégse gombra kattint
  cancelDeletion() {
    this.confirmationVisible = false;
  }

  // 3️⃣ ha a felhasználó megerősíti a törlést
  confirmDeletion() {
    if (!this.productId) {
      console.error('Nincs megadva productId');
      return;
    }

    const url = `http://192.168.100.147:8000/api/destroyproduct/${this.productId}`;

    this.http.delete(url).subscribe({
      next: (res: any) => {
        console.log('Sikeresen törölve', res);
        this.confirmationVisible = false;
        this.router.navigate(['/my-products']); // vagy emitter, ha listában használod
      },
      error: (err) => {
        console.error('Hiba a törlés során', err);
        alert('Hiba történt a termék törlésekor.');
        this.confirmationVisible = false;
      },
    });
  }
}
