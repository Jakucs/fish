import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { AdminapiService } from '../shared/adminapi.service';
import { CommonModule } from '@angular/common';
import { ProductapiService } from '../shared/productapi.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminpage',
  imports: [CommonModule, FormsModule],
  templateUrl: './adminpage.component.html',
  styleUrl: './adminpage.component.css'
})
export class AdminpageComponent {

  private baseUrl = 'http://localhost:8000/api';

  originalUsers: any[] = [];
  searchQuery: string = '';
  users: any[] = [];

  productSearchQuery: string = '';
  ads: any[] = []; 
  selectedUser: any = null;
  errorMessage = '';
  successMessage = '';
  showUsers = false;
  showAds = false;
  currentUser: any;

  currentUserPage = 1;
  lastUserPage = 1;
  currentAdPage = 1;
  lastAdPage = 1;


  constructor(
    private router: Router,
    private adminapi: AdminapiService,
    private productapi: ProductapiService
  ) {}

    ngOnInit(): void {
          
      this.adminapi.getCurrentUser().subscribe({
        next: (res: any) => {
          this.currentUser = res;
        },
        error: (err) => console.error('Nem sikerült lekérni a bejelentkezett usert', err)
      });

      
      this.loadUsers(this.currentUserPage);
  }


  onUsersClick(): void {
    this.showUsers = true;
    this.showAds = false;
    this.loadUsers(this.currentUserPage);
  }

  onAdsClick(): void {
    this.showUsers = false;
    this.showAds = true;
    this.loadAds(this.currentAdPage);
  }
      
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
        this.selectedUser.is_active = res.data.is_active; 
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

      
    toggleAdminRole() {
      const userId = this.selectedUser.id;

      this.adminapi.toggleAdmin(userId).subscribe({
        next: (res: any) => {
          if (res.success) {
            // Sikeres backend váltás - frissítjük a UI-t
            this.selectedUser.role = res.role;
          }
        },
        error: (err) => {
          console.error('Hiba a toggleAdminRole híváskor:', err);
        }
      });
    }




    
    closeDetails(): void {
      this.selectedUser = null;
    }

    loadUsers(page: number = 1, search: string = ''): void {
      this.adminapi.getUsers(page, search).subscribe({
        next: (res: any) => {
          this.users = res.users || [];
          this.currentUserPage = res.current_page || 1;
          this.lastUserPage = res.last_page || 1;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Nem sikerült lekérni a felhasználókat.';
        }
      });
    }
    searchUsers() {
      this.loadUsers(1, this.searchQuery);
    }

    clearSearch() {
      this.searchQuery = '';
      this.loadUsers(1);
  }




  loadAds(page: number = 1, search: string = ''): void {
    this.productapi.getProductsPublic(page, search).subscribe({
      next: (res: any) => {
        this.ads = res.data || [];
        this.currentAdPage = res.current_page || 1;
        this.lastAdPage = res.last_page || 1;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Nem sikerült lekérni a hirdetéseket.';
      }
    });
  }


  

  searchProducts() {
    this.loadAds(1, this.productSearchQuery);
  }

  clearProductSearch() {
    this.productSearchQuery = '';
    this.loadAds(1);
  }




/*  filterUsers() {
    const q = (this.searchQuery || '').trim().toLowerCase();

    if (!q) {
      this.users = [...this.originalUsers];
      return;
    }

    this.users = this.originalUsers.filter(u => {
      const username = (u.username || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const role = (u.role + '').toLowerCase();  // <--- FONTOS

      return (
        username.includes(q) ||
        email.includes(q) ||
        role.includes(q)
      );
    });
  } */


/*  clearSearch() {
    this.searchQuery = '';
    this.users = [...this.originalUsers];
  } */



  goToUserPage(page: number) {
    if (page >= 1 && page <= this.lastUserPage) {
      this.loadUsers(page);
    }
  }

  goToAdPage(page: number) {
    if (page >= 1 && page <= this.lastAdPage) {
      this.loadAds(page);
    }
  }

  nextUserPage() {
    this.goToUserPage(this.currentUserPage + 1);
  }

  prevUserPage() {
    this.goToUserPage(this.currentUserPage - 1);
  }

  nextAdPage() {
    this.goToAdPage(this.currentAdPage + 1);
  }

  prevAdPage() {
    this.goToAdPage(this.currentAdPage - 1);
  }

}