import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


    showForgotPasswordForm = false;
  forgotEmail = '';

  constructor(private http: HttpClient) {}

  sendResetLink() {
    if (!this.forgotEmail) {
      alert('Kérlek add meg az email címed!');
      return;
    }

    this.http.post('http://localhost:8000/api/forgot-password', {
      email: this.forgotEmail
    }).subscribe({
      next: (res: any) => alert(res.message),
      error: (err) => alert(err.error.message || 'Hiba történt.')
    });
  }
}
