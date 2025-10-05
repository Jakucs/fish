import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fish-project';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(){
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAds() {
    this.router.navigate(['/ads']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToLogout() {
    this.router.navigate(['/logout']);
  }

}
