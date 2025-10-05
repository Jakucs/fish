import { Component, ViewChild } from '@angular/core';
import { PicsUploadComponent } from "../pics-upload/pics-upload.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-upload',
  imports: [PicsUploadComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './ad-upload.component.html',
  styleUrl: './ad-upload.component.css'
})
export class AdUploadComponent {
  @ViewChild(PicsUploadComponent) picsUpload!: PicsUploadComponent;

  productForm!: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.builder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      price: ['', Validators.required],
      category: ['', Validators.required]
    });
  }


  saveProduct() {
    // Ha a form invalid, mindent "touched"-ra állítunk, így piros lesz
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return; // kilépünk, nem mentünk, nem töltjük fel a képet
    }

    // Ha a form valid, csak ekkor indítjuk el a képfeltöltést
    if (this.picsUpload.selectedFile) {
      this.picsUpload.uploadImage();
    }

    // Itt mehet a form adatainak mentése a backend-re
    console.log('Hirdetés mentve:', this.productForm.value);
  }


}
