import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


  forgotEmail = '';
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  sendResetLink() {
    if (!this.forgotEmail) {
      this.errorMessage = 'Kérlek, add meg az email címed!';
      this.successMessage = '';
      return;
    }

    const url = `${environment.apiUrl}/forgot-password`;  // <-- environment használat

    this.http.post(url, { email: this.forgotEmail }).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Hiba történt a küldés során.';
        this.successMessage = '';
      }
    });
  }

}
