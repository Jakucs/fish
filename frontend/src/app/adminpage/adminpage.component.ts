import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { AdminapiService } from '../shared/adminapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminpage',
  imports: [CommonModule],
  templateUrl: './adminpage.component.html',
  styleUrl: './adminpage.component.css'
})
export class AdminpageComponent {

  private baseUrl = 'http://192.168.100.147:8000/api';

  users: any[] = [];
  selectedUser: any = null; // 🔹 éppen kiválasztott user
  errorMessage = '';
  successMessage = '';
  showUsers = false;

  currentPage = 1;
  lastPage = 1;

  constructor(
    private router: Router,
    private adminapi: AdminapiService
  ) {}

  ngOnInit(): void {}

  onUsersClick(): void {
    this.showUsers = true;
    this.loadUsers(this.currentPage);
  }

  onAdsClick(): void {
    this.showUsers = false;
  }

      // 🔹 Részletek betöltése backendről
  showDetails(user: any): void {
    const userId = user.id;

    this.adminapi.getUserDetails(userId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.selectedUser = res.data;
        } else {
          this.errorMessage = 'Nem sikerült betölteni a felhasználó adatait.';
        }
      },
      error: (err) => {
        console.error('Hiba a részletek lekérésekor:', err);
        this.errorMessage = 'Nem sikerült betölteni a felhasználó részleteit.';
      }
    });
  }


  toggleUserActive(): void {
  if (!this.selectedUser) return;

  const userId = this.selectedUser.id;

  this.adminapi.toggleUserActive(userId).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.selectedUser.is_active = res.data.is_active; // ✅ azonnal frissíted a UI-t
        this.successMessage = `A felhasználó státusza módosítva: ${res.data.is_active ? 'Aktív' : 'Inaktív'}`;
      } else {
        this.errorMessage = 'Nem sikerült módosítani a státuszt.';
      }
    },
    error: (err) => {
      console.error('Hiba a státusz módosításakor:', err);
      this.errorMessage = 'Hiba történt a státusz módosításakor.';
    }
  });
}


    // 🔹 Részletek bezárása
    closeDetails(): void {
      this.selectedUser = null;
    }

  loadUsers(page: number): void {
    this.adminapi.getUsers(page).subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.currentPage = res.current_page || 1;
        this.lastPage = res.last_page || 1;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Nem sikerült lekérni a felhasználókat.';
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.loadUsers(page);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

}