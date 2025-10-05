import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
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

  ngOnInit() {
    this.registerForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

    register(){
    if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }
    console.log(this.registerForm.value)
    this.authapi.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        if (response.success){
          console.log("Sikerült a regisztráció! " + response.message)
          this.router.navigate(['successfulregister']);
          const email = this.registerForm.value.email;
          this.authapi.setEmail(email);
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
        <p>Jelszó minimum 7 karakter! Kisbetűt és számot is tartalmazzon!</p> <hr>
        `
      }
    })
  }

}