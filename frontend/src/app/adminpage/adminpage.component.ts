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
  errorMessage = '';
  showUsers = false;

  constructor(
    private router: Router,
    private adminapi: AdminapiService,
    private authapi: AuthapiService
  ){}

    onUsersClick(): void {
    this.showUsers = true; // táblázat megjelenítése
    this.loadUsers();
  }

    onAdsClick(): void {
    this.showUsers = false; // táblázat elrejtése

  }

  
  loadUsers(): void {
    this.adminapi.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data || response; // backend válasz formátumától függ
        console.log('Felhasználók:', this.users);
      },
      error: (error) => {
        console.error('Hiba a lekéréskor:', error);
        this.errorMessage = 'Nem sikerült lekérni a felhasználókat.';
      }
    });

  }

}