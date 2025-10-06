import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryapiService {

  private cloudName = 'ddt30o1t2';
  private uploadPreset = 'ml_default';

  constructor(private http: HttpClient) {}

    resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<Blob> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e: any) => {
          img.src = e.target.result;

          img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d')!;

            // Arányos méretezés
            let ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Hiba a blob generálásnál'));
              },
              'image/jpeg',
              quality
            );
          };

          img.onerror = (err) => reject(err);
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
  }

    uploadFile(file: File, folder: string = 'user_uploads'): Observable<any> {
      // pl. max 1024x1024 px, 80% minőség
      return from(this.resizeImage(file, 1024, 1024, 0.8)).pipe(
        switchMap((resizedBlob) => {
          const formData = new FormData();
          formData.append('file', resizedBlob, file.name);
          formData.append('upload_preset', this.uploadPreset);
          formData.append('folder', folder);

          return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData);
        })
      );
    }


}
