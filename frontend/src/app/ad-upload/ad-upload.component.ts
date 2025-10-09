import { Component, ViewChild } from '@angular/core';
import { PicsUploadComponent } from "../pics-upload/pics-upload.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductapiService } from '../shared/productapi.service';
import { UserapiService } from '../shared/userapi.service';
import { PicsShareService } from '../shared/pics-share.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ad-upload',
  imports: [PicsUploadComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ad-upload.component.html',
  styleUrl: './ad-upload.component.css'
})
export class AdUploadComponent {
  @ViewChild(PicsUploadComponent) picsUpload!: PicsUploadComponent;

  productForm!: FormGroup;
  postalCode: string = '';
  city: string = '';
  isCityReadonly = true;

  constructor(
    private builder: FormBuilder,
    private productapi: ProductapiService,
    private userapi: UserapiService,
    private picsshare: PicsShareService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      type_id: ['', Validators.required],
      user_id: [localStorage.getItem('userId')],
      price: ['', Validators.required],
      image: [''],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      city: ['']
    });
  }

  onFreePriceChange(event: any) {
  if (event.target.checked) {
    // Checkbox be van pipálva → ár 0
    this.productForm.get('price')?.setValue(0);
  } else {
    // Checkbox üres → ár mező törlése vagy marad az előző érték
    this.productForm.get('price')?.setValue(null);
  }
}


  saveProduct() {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    if (this.picsUpload.selectedFiles && this.picsUpload.selectedFiles.length > 0) {
      this.picsUpload.uploadImages().subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            const urls = res.map(r => r.secure_url);
            this.productForm.patchValue({ image: JSON.stringify(urls) });

            // ⬇️ Itt adod tovább más komponenseknek
            this.picsshare.updateUrls(urls);
          }

          this.saveProductToBackend();
        },
        error: (err: any) => {
          console.error('Feltöltési hiba:', err);
        }
      });
    } else {
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
        } else{
          console.error('❌ Sikertelen mentés:', res);
          alert(`Hiba a mentés során: ${res.message}`);
        }
      },
        error: (err) => {
          console.error('Mentési hiba:', err);
          alert('Hiba történt a hirdetés feladása során. Kérlek, próbáld újra.');
        }
      });
    } else {
      console.warn('Az űrlap érvénytelen, töltsd ki az összes mezőt!');
      this.productForm.markAllAsTouched();
    }
  }



  getCityByZip() {
    const postalCode = this.productForm.get('postalCode')?.value;

    if (postalCode && postalCode.length === 4) {
      this.http.get<any>(`https://api.zippopotam.us/hu/${postalCode}`).subscribe({
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
