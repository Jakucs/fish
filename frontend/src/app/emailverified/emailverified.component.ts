import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emailverified',
  imports: [],
  templateUrl: './emailverified.component.html',
  styleUrl: './emailverified.component.css'
})
export class EmailverifiedComponent {
  constructor(private router: Router) {}

    goToLogin() {
    this.router.navigate(['/login']);
  }

}
