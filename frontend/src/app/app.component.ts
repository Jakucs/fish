import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './shared/loading.service';
import { LoadingBarComponent } from "./loading-bar/loading-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fish-project';
  isLoggedIn: boolean = false;

  constructor(private router: Router, public loadingService: LoadingService) {}

  ngOnInit(){
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
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

  goToAdUpload(){
    if (this.isLoggedIn) {
      this.router.navigate(['/ad_upload' ]);
    } else {
      this.router.navigate(['/login' ]);
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
