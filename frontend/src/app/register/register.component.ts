import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  errorMessageFromBackend!: any;
  showErrorCard: boolean = false;


  constructor(
    private builder: FormBuilder,
    private authapi: AuthapiService,
    private router: Router
  ) { }

    ngOnInit(){
    this.registerForm = this.builder.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password_confirmation: ['']
    })
  }

    register(){
    console.log(this.registerForm.value)
    this.authapi.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        if (response.success){
          console.log("Sikerült a regisztráció! " + response.message)
          this.router.navigate([{outlets: {top: ['successfulregister']}}]);
        }else{
          console.log('Nem sikerült a regisztráció', response)
          this.errorMessageFromBackend = response.message;
          }
      },
      error: (error: HttpErrorResponse) => {
        console.log('Regisztrációs hiba:', error);
        this.showErrorCard = true;
        this.errorMessageFromBackend = `<hr>
        <p>Valós email cím feltétel!</p> <hr> 
        <p>Jelszó minimum 8 karakter! Kisbetűt és számot is tartalmazzon!</p> <hr>
        `
      }
    })
  }

}