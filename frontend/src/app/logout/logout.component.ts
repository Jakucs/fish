import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(
    private app: AppComponent,
    private router: Router,
    private authapi: AuthapiService
  ) { }

  ngOnInit(){
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    console.log("Kijelentkezés...");
    this.app.isLoggedIn = false;
    this.authapi.logout().subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.error('Hiba a kijelentkezés során:', err);
      }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }


}
