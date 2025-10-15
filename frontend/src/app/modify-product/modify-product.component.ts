import { Component } from '@angular/core';
import { ProductapiService } from '../shared/productapi.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modify-product',
  imports: [ReactiveFormsModule],
  templateUrl: './modify-product.component.html',
  styleUrl: './modify-product.component.css'
})
export class ModifyProductComponent {

    productForm!: FormGroup;
    isCityReadonly = false;
    productId!: number;

  constructor(
    private productapi: ProductapiService,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private http: HttpClient
  ) { }

    ngOnInit(): void {
    // Reactive form inicializálása
    this.productForm = this.builder.group({
      name: [''],
      description: [''],
      price: [''],
      condition: ['új'],
      postal_code: [''],
      city: ['']
    });

    // URL-ből az ID
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.getProductDetails(this.productId);
    }
  }

    getProductDetails(id: number) {
    this.productapi.getProduct(id).subscribe({
      next: (res) => {
        const product = res.data;
        console.log('Betöltött termék:', product);
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          condition: product.condition,
          postal_code: product.postal_code,
          city: product.city
        });
        this.isCityReadonly = !!product.city;
      },
      error: (err) => {
        console.error('Hiba a termék lekérésekor:', err);
      }
    });
  }

    getCityByZip() {
    const postal_code = this.productForm.get('postal_code')?.value;

    if (postal_code && postal_code.length === 4) {
      this.http.get<any>(`https://api.zippopotam.us/hu/${postal_code}`).subscribe({
        next: (data) => {
          const city = data.places?.[0]?.['place name'];
          if (city) {
            this.productForm.patchValue({ city: city });
            this.isCityReadonly = true;
          } else {
            this.isCityReadonly = false;
          }
        },
        error: (err) => {
          console.error('API hiba:', err);
          this.isCityReadonly = false;
        }
      });
    } else {
      this.isCityReadonly = false;
    }
  }


    onSubmit() {
    if (this.productForm.valid) {
      const updatedProduct = this.productForm.value;
      console.log('Mentendő adatok:', updatedProduct);

      this.productapi.modifyProduct(this.productId, updatedProduct).subscribe({
        next: (res) => {
          console.log('Sikeres módosítás:', res);
          alert('Termék sikeresen frissítve!');
        },
        error: (err) => {
          console.error('Hiba a módosítás közben:', err);
        }
      });
    }
  }


}
