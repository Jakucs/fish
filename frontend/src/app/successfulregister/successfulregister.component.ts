import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { LoadingService } from '../shared/loading.service';

@Component({
  selector: 'app-successfulregister',
  imports: [],
  templateUrl: './successfulregister.component.html',
  styleUrl: './successfulregister.component.css'
})
export class SuccessfulregisterComponent {

  email: string = '';

    constructor(private router: Router, private authapi: AuthapiService, private loadingService: LoadingService){}

  ngOnInit() {
    this.email = this.authapi.getEmail();
      this.loadingService.show();
  setTimeout(() => this.loadingService.hide(), 2000);
  }

    navigateToLogin(){
    this.router.navigate(['login']);
  }
}