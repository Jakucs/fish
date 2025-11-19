import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './shared/loading.service';
import { LoadingBarComponent } from "./loading-bar/loading-bar.component";
import { ActivityService } from './shared/activity.service';
import { AuthapiService } from './shared/authapi.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'fish-project';
  isLoggedIn: boolean = false;
  private INACTIVITY_LIMIT = 10 * 60 * 1000; // 15 perc

  constructor(
    private router: Router,
    public loadingService: LoadingService,
    private activityService: ActivityService,
    private authService: AuthapiService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    this.startInactivityCheck();
  }

  // ---------------------
  // AUTOMATA KIJELENTKEZTETÉS
  // ---------------------
  startInactivityCheck() {
    setInterval(() => {
      const now = Date.now();
      const lastActivity = this.activityService.getLastActivity();

      if (now - lastActivity > this.INACTIVITY_LIMIT) {
        this.logoutUser();
      }

    }, 60 * 1000); // 1 percenként ellenőriz
  }

  logoutUser() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToMyAds() {
    this.router.navigate(['/myads']);
  }

  goToFavourites() {
    this.router.navigate(['/favourites']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToLogout() {
    this.router.navigate(['/logout']);
  }

  goToAdUpload() {
    if (this.isLoggedIn) {
      this.router.navigate(['/ad_upload']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  refreshProducts() {
    if (this.router.url === '/products') {
      window.location.reload();
    } else {
      this.router.navigate(['/products']);
    }
  }
}
