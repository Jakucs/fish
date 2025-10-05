import { Component, ViewChild } from '@angular/core';
import { PicsUploadComponent } from "../pics-upload/pics-upload.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductapiService } from '../shared/productapi.service';

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
  ) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      type_id: ['', Validators.required],
      user_id: [localStorage.getItem('userId')],
      price: ['', Validators.required],
      image: [''],
    });
  }


saveProduct() {
  if (this.productForm.invalid) {
    Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
    return;
  }

  if (this.picsUpload.selectedFile) {
    // Kép feltöltése és megvárása
    this.picsUpload.uploadImage().subscribe({
      next: (res: any) => {
        if (res && res.secure_url) {
          this.productForm.patchValue({ image: res.secure_url });
        }

        // Mentés a backendre
        this.saveProductToBackend();
      },
      error: (err) => {
        console.error('Feltöltési hiba:', err);
      }
    });
  } else {
    // Ha nincs kép, csak simán mentés
    this.saveProductToBackend();
  }
}

saveProductToBackend() {
  console.log('Hirdetés mentve:', this.productForm.value);
  // this.productapi.addProduct(this.productForm.value).subscribe(...)
}




}
