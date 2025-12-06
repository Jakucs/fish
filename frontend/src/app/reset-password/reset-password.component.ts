import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    FormsModule, CommonModule
  ]
})
export class ResetPasswordComponent {

  email!: string;
  token!: string;
  password = '';
  success = false;

  constructor(private route: ActivatedRoute, private authapi: AuthapiService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  reset() {
    this.authapi.resetPassword(this.email, this.token, this.password)
      .subscribe(() => {
        this.success = true;
      });
  }

}
