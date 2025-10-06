import { Component } from '@angular/core';
import { CloudinaryapiService } from '../shared/cloudinaryapi.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-pics-upload',
  imports: [],
  templateUrl: './pics-upload.component.html',
  styleUrl: './pics-upload.component.css'
})
export class PicsUploadComponent {
  selectedFile: File | null = null;
  uploadUrl: string = '';

  constructor(private uploadService: CloudinaryapiService){}

    ngOnInit() {
      
    }

    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
      }
    }

    uploadImage(): Observable<any> {
      if (!this.selectedFile) return of(null); // ha nincs fájl, adjon vissza null-t

      return this.uploadService.uploadFile(this.selectedFile).pipe(
        tap((res: any) => {
          this.uploadUrl = res.secure_url;
          console.log('Kép feltöltve, URL:', this.uploadUrl);
        })
      );
    }

}
