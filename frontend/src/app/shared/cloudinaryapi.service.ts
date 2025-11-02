import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, switchMap } from 'rxjs';

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

    uploadFiles(files: File[], folder: string = 'user_uploads'): Observable<any[]> {
      // Minden fájl resize-olása és feltöltése
      const uploadRequests = files.map(file =>
        from(this.resizeImage(file, 1280, 1280, 0.7)).pipe( // Promise - Observable
          switchMap((resizedBlob: Blob) => {
            const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('file', resizedFile);
            formData.append('upload_preset', this.uploadPreset);
            formData.append('folder', folder);

            return this.http.post('https://api.cloudinary.com/v1_1/ddt30o1t2/image/upload', formData);
          })
        )
      );

      return forkJoin(uploadRequests);
    }




}
