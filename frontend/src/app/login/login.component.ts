import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    constructor(
    private builder: FormBuilder,
    private router: Router,
    private authapi: AuthapiService
  ) { }

  loggedIn = false;
  errorMessageFromBackend: string | null = null;
  loginForm !: FormGroup;
  showErrorCard: boolean = false;

  ngOnInit(){
    this.loginForm = this.builder.group({
      login: new FormControl(''),
      password: new FormControl('')
    });
    this.loggedIn = this.authapi.isLoggedIn();
  }

  login() {
    this.errorMessageFromBackend = null;
    this.showErrorCard = false;

    this.authapi.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (!res.data || !res.data.token) {
          this.errorMessageFromBackend = 'Az azonosítás sikertelen. Nincs érvényes token!';
          this.showErrorCard = true;
          return;
        }

        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', res.data.username);
        localStorage.setItem('userId', res.data.user_id.toString());
        localStorage.setItem('email', res.data.email);

        this.loggedIn = true;
        this.loginForm.reset();
        this.router.navigate(['myads']).then(() => window.location.reload());
      },
      error: (error: HttpErrorResponse) => {
        console.log("Belépési hiba:", error);

        // Ha a backend 401/422-t küld, itt jelenítjük meg:
        this.errorMessageFromBackend = "Hibás felhasználónév vagy jelszó.";
        this.showErrorCard = true;
      }
    });
  }


    navigateToRegister(){
    this.router.navigate(['register' ]); //navigálás a regisztrációs oldalra
  }

    ngAfterViewInit() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }


}
