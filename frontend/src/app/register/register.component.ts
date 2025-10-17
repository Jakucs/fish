import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthapiService } from '../shared/authapi.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // <-- kis 's' a végén!
})
export class RegisterComponent {

  registerForm!: FormGroup;
  errorMessageFromBackend: string | null = null;
  showErrorCard: boolean = false;

  constructor(
    private builder: FormBuilder,
    private authapi: AuthapiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/[a-z]/), // kisbetű
        Validators.pattern(/[A-Z]/), // nagybetű
        Validators.pattern(/[0-9]/)  // szám
      ]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); // 👈 saját validátor hozzáadva
  }

  // --- Jelszó egyezés ellenőrzése ---
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;
    return pass === confirm ? null : { notMatching: true };
  };

        // --- Regisztrációs logika ---
      register() {
        if (this.registerForm.invalid) {
          this.registerForm.markAllAsTouched();
          return;
        }

        this.authapi.register(this.registerForm.value).subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log("Sikerült a regisztráció! " + response.message);
              const email = this.registerForm.value.email;
              this.authapi.setEmail(email);
              this.router.navigate(['successfulregister']);
            }
          },
          error: (error: HttpErrorResponse) => {
        console.log('❌ Regisztrációs hiba:', error);

        this.showErrorCard = true;

        // 🔹 Laravel validációs hiba esetén
        if (error.status === 422 && error.error?.errors) {
          const backendErrors = error.error.errors;

          // Végigmegyünk a mezőkön és beállítjuk a hibát Angular oldalról is
          Object.keys(backendErrors).forEach((field) => {
            const control = this.registerForm.get(field);
            if (control) {
              control.setErrors({ backend: backendErrors[field][0] });
            }
          });

          // 🔹 Összegyűjtjük a hibaüzeneteket egyetlen stringbe
          const allMessages = Object.values(backendErrors)
            .flat()
            .join('\n');

          this.errorMessageFromBackend = allMessages;
        } else if (error.error?.message) {
          // Laravel más típusú hiba (pl. success: false)
          this.errorMessageFromBackend = error.error.message;
        } else {
          // Egyéb hiba
          this.errorMessageFromBackend = 'Ismeretlen hiba történt a regisztráció során.';
        }
      }

        });
      }

}
