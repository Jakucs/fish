import { Component, ViewChild } from '@angular/core';
import { PicsUploadComponent } from "../pics-upload/pics-upload.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductapiService } from '../shared/productapi.service';
import { UserapiService } from '../shared/userapi.service';
import { PicsShareService } from '../shared/pics-share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-upload',
  imports: [PicsUploadComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './ad-upload.component.html',
  styleUrl: './ad-upload.component.css'
})
export class AdUploadComponent {
  @ViewChild(PicsUploadComponent) picsUpload!: PicsUploadComponent;

  productForm!: FormGroup;

  constructor(
    private builder: FormBuilder,
    private productapi: ProductapiService,
    private userapi: UserapiService,
    private picsshare: PicsShareService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      type_id: ['', Validators.required],
      user_id: [localStorage.getItem('userId')],
      price: ['', Validators.required],
      image: [''],
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
          this.router.navigate(['/successfulupdate']);
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
      console.log('Hirdetés mentve:', this.productForm.value);
      const headers = this.userapi.makeHeader();
      this.productapi.addProduct(this.productForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
          console.log('✅ Sikeres mentés:', res);
          alert('Sikeres mentés!');
          this.productForm.reset();
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
}
