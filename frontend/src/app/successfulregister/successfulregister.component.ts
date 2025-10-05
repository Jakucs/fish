import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';

@Component({
  selector: 'app-successfulregister',
  imports: [],
  templateUrl: './successfulregister.component.html',
  styleUrl: './successfulregister.component.css'
})
export class SuccessfulregisterComponent {

  email: string = '';

    constructor(private router: Router, private authapi: AuthapiService){}

  ngOnInit() {
    this.email = this.authapi.getEmail();
  }

    navigateToLogin(){
    this.router.navigate([{outlets: {top: ['login']}}]);
  }
}