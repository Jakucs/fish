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