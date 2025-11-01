import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductapiService } from '../shared/productapi.service';
import { CommonModule } from '@angular/common';
import { PicsUploadComponent } from '../pics-upload/pics-upload.component';

@Component({
  selector: 'app-modify-images',
  imports: [CommonModule, PicsUploadComponent],
  templateUrl: './modify-images.component.html',
  styleUrl: './modify-images.component.css'
})
export class ModifyImagesComponent {
  @ViewChild(PicsUploadComponent) picsUpload!: PicsUploadComponent;
  productId!: number;
  images: string[] = [];

    constructor(
    private route: ActivatedRoute,
    private productService: ProductapiService
  ) {}



    ngOnInit() {
    // Product ID lekérése az URL-ből
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadImages();
  }

    loadImages() {
  this.productService.getPictures(this.productId).subscribe({
    next: (res: any) => {
      // Mindig tömb lesz
      this.images = Array.isArray(res.image) ? res.image : res.image ? [res.image] : [];
    },
    error: (err) => {
      console.error('Hiba a képek lekérésekor:', err);
      this.images = []; // ha hiba van, legalább üres tömb
    }
  });
}


      deleteImage(index: number, url: string) {
    if (!confirm('Biztosan törlöd a képet?')) return;

    this.productService.destroyPicture(this.productId, url).subscribe({
      next: (res: any) => {
        // mindig tömb
        if (!Array.isArray(this.images)) this.images = [];

        // lokális törlés
        if (index >= 0 && index < this.images.length) {
          this.images.splice(index, 1);
        }

        // backend válasz frissítése
        if (res?.image) {
          this.images = Array.isArray(res.image) ? res.image : [];
        }
      },
      error: (err) => console.error('Hiba a kép törlésekor:', err)
    });
  }






  onUploadComplete(urls: string[]) {
    // Új képek hozzáadása a termékhez
    this.productService.newPicture(this.productId, urls).subscribe({
      next: (res) => {
        this.images = res.image;
      },
      error: (err) => console.error('Hiba új kép hozzáadásakor:', err)
    });

     this.images = urls;
  }


    saveImages() {
  if (this.picsUpload.selectedFiles && this.picsUpload.selectedFiles.length > 0) {
    this.picsUpload.uploadImages().subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          // Küldjük a képek URL-jeit és public_id-it is
          const images = res.map(r => ({
            url: r.secure_url,
            public_id: r.public_id
          }));

          this.productService.newPicture(this.productId, images as any).subscribe({
            next: (res: any) => {
              this.images = res.image;
            },
            error: (err: any) => console.error('Hiba új kép hozzáadásakor:', err)
          });
        }
      },
      error: (err: any) => console.error('Feltöltési hiba:', err)
    });
  } else {
    console.warn('Nincs kiválasztott kép feltöltésre.');
  }
}






}
