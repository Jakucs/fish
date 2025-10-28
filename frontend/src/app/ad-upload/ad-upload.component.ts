import { Component, ViewChild } from '@angular/core';
import { PicsUploadComponent } from "../pics-upload/pics-upload.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductapiService } from '../shared/productapi.service';
import { UserapiService } from '../shared/userapi.service';
import { PicsShareService } from '../shared/pics-share.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ValidatorService } from '../shared/validator.service';
import { InactiveGuardComponent } from '../inactive-guard/inactive-guard.component';

@Component({
  selector: 'app-ad-upload',
  imports: [PicsUploadComponent, ReactiveFormsModule, CommonModule, FormsModule, InactiveGuardComponent],
  templateUrl: './ad-upload.component.html',
  styleUrl: './ad-upload.component.css'
})
export class AdUploadComponent {
  @ViewChild(PicsUploadComponent) picsUpload!: PicsUploadComponent;

  productForm!: FormGroup;
  postal_code: string = '';
  city: string = '';
  isCityReadonly = true;
  showPhoneInput = true;
  backendErrorMessage: string = '';
  freePriceChecked = false;

  constructor(
    private builder: FormBuilder,
    private productapi: ProductapiService,
    private userapi: UserapiService,
    private picsshare: PicsShareService,
    private router: Router,
    private http: HttpClient,
    private validator: ValidatorService
  ) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
          name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^(?!\d+$).+/) // ne lehessen csak szám
        ]
      ],
      description: ['', [Validators.maxLength(2000)]],
      type_id: ['', Validators.required],
      user_id: [localStorage.getItem('userId')],
      price: [
        '',
        [
          Validators.required,
          Validators.max(99999999),
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      image: [''],
      condition: ['', Validators.required],
      status: ['active', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s-]+$/)
        ]
      ],
        phone_number: ['', {
        validators: [Validators.required],
        asyncValidators: [this.validator.phoneExistsValidator()],
        updateOn: 'blur' // vagy 'change', ha gépelés közben is akarod
      }] //<---Felhasználjuk az aszinkron validátort először!
    });


    // Alapból mutatjuk az inputot
    this.showPhoneInput = true;

      this.userapi.getUserDetails().subscribe({
      next: (res: any) => {
        console.log('Felhasználói adatok:', res);
        if (res.success) {
          const phone = res.data.phone_number;
          if (phone) {
            // ✅ Ha már van telefonszám az adatbázisban
            this.showPhoneInput = false;
            this.productForm.patchValue({ phone_number: phone });

            // ⚙️ Eltávolítjuk a kötelező és async validátorokat
            const phoneCtrl = this.productForm.get('phone_number');
            phoneCtrl?.clearValidators();
            phoneCtrl?.clearAsyncValidators();
            phoneCtrl?.updateValueAndValidity();
          } else {
            // ⚙️ Ha nincs telefonszám — visszaállítjuk a validátorokat
            this.showPhoneInput = true;
            const phoneCtrl = this.productForm.get('phone_number');
            phoneCtrl?.setValidators([Validators.required]);
            phoneCtrl?.setAsyncValidators([this.validator.phoneExistsValidator()]);
            phoneCtrl?.updateValueAndValidity();
          }
        }
      }, // Hiba esetén ne mutassuk a page-t
      error: (err: any) => {
        console.error('Hiba a felhasználói adatok lekérésekor:', err);

        // ✅ Ha a backend 403-at küld az inaktív felhasználó miatt
        if (err.status === 403 && err.error?.message) {
          this.backendErrorMessage = err.error.message;
        }

        // API hiba esetén mutassuk az inputot (ha nem 403)
        if (err.status !== 403) {
          this.showPhoneInput = true;
        }
      }
  });

  }


    onFreePriceChange(event: Event) {
      const checkbox = event.target as HTMLInputElement;
      this.freePriceChecked = checkbox.checked;

      const priceControl = this.productForm.get('price');

      if (this.freePriceChecked) {
        priceControl?.setValue(0); // 0 Ft lesz
      }
  }


  saveProduct() {
    console.log(this.productForm);

    // ✅ 1️⃣ Ellenőrizzük, hogy érvényes-e a form
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      return; // ⛔️ Ne menjen tovább
    }

    // ✅ 2️⃣ Ha van kép, előbb azt töltjük fel
    if (this.picsUpload.selectedFiles && this.picsUpload.selectedFiles.length > 0) {
      this.picsUpload.uploadImages().subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            const urls = res.map(r => r.secure_url);
            this.productForm.patchValue({ image: JSON.stringify(urls) });

            // Esetleg más komponens is használja
            this.picsshare.updateUrls(urls);
          }

          // Mentés a backendre
          this.saveProductToBackend();
        },
        error: (err: any) => {
          console.error('Feltöltési hiba:', err);
        }
      });
    } else {
      // ✅ 3️⃣ Ha nincs kép, közvetlen mentés
      this.saveProductToBackend();
    }
  }


  saveProductToBackend() {
    if (this.productForm.valid) {
      const headers = this.userapi.makeHeader();
      this.productapi.addProduct(this.productForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
          console.log('✅ Sikeres mentés:', res);
          this.productForm.reset();
          this.router.navigate(['/successfulupdate']);
          console.log('Hirdetés mentve:', this.productForm.value);
          this.backendErrorMessage = '';
        } else{
          console.error('❌ Sikertelen mentés:', res);
          alert(`Hiba a mentés során: ${res.message}`);
        }
      },
      error: (err: any) => {
        console.log("Backend error object:", err);

        // ✅ Itt a tényleges hibaüzenet a backendtől
        this.backendErrorMessage = err?.error?.message || 'Ismeretlen hiba történt';
      }

      });
    } else {
      console.warn('Az űrlap érvénytelen, töltsd ki az összes mezőt!');
      this.productForm.markAllAsTouched();
    }
  }



  getCityByZip() {
    const postal_code = this.productForm.get('postal_code')?.value;

    if (postal_code && postal_code.length === 4) {
      this.http.get<any>(`https://api.zippopotam.us/hu/${postal_code}`).subscribe({
        next: (data) => {
          const city = data.places?.[0]?.['place name'];
          if (city) {
            this.productForm.patchValue({ city: city });
            this.isCityReadonly = true; // ✅ automatikus találat → readonly
          } else {
            console.warn('Nem található város az adott irányítószámhoz');
            this.isCityReadonly = false; // ❌ nem található → engedjük kézzel
          }
        },
        error: (err) => {
          console.error('API hiba:', err);
          this.isCityReadonly = false; // ❌ API hiba → engedjük kézzel
        }
      });
    } else {
      this.isCityReadonly = false; // ha még nincs rendes irányítószám
    }
  }


}
