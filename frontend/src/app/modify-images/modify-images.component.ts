import { Component } from '@angular/core';
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
  productId!: number;
  images: string[] = [];

    constructor(
    private route: ActivatedRoute,
    private productService: ProductapiService // szolgáltatás a képekhez
  ) {}



    ngOnInit() {
    // Product ID lekérése az URL-ből
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadImages();
  }

    loadImages() {
      this.productService.getPictures(this.productId).subscribe({
        next: (res: any) => {
          this.images = Array.isArray(res.image) ? res.image : [res.image];
        },
        error: (err) => console.error('Hiba a képek lekérésekor:', err)
      });
    }

      deleteImage(index: number, url: string) {
    if (!confirm('Biztosan törlöd a képet?')) return;

    this.productService.destroyPicture(this.productId, url).subscribe({
      next: (res: any) => {
        this.images = res.image; // backend a frissített tömböt adja vissza
      },
      error: (err: any) => console.error('Hiba a kép törlésekor:', err)
    });
  }

  updateImage(index: number) {
    // Itt lehet megnyitni egy file inputot vagy modal-t
    // Például: új kép feltöltése Cloudinary-ra → updatePicture()
    const newUrl = prompt('Add meg az új kép URL-jét:');
    if (!newUrl) return;

    this.productService.updatePicture(this.productId, index, newUrl).subscribe({
      next: (res: any) => {
        this.images = res.image;
      },
      error: (err: any) => console.error('Hiba a kép frissítésekor:', err)
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




}
