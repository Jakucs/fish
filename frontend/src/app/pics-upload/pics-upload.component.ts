import { Component } from '@angular/core';
import { CloudinaryapiService } from '../shared/cloudinaryapi.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pics-upload',
  imports: [CommonModule],
  templateUrl: './pics-upload.component.html',
  styleUrl: './pics-upload.component.css'
})
export class PicsUploadComponent {
  selectedFiles: any[] = [];
  uploadUrls: string[] = [];
  lastUploadedPublicIds: string[] = []; //if we need to delete the images later
  readonly MAX_FILES = 10;

  constructor(private uploadService: CloudinaryapiService){}

    ngOnInit() {
      
    }

    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const newFiles = Array.from(input.files);

      if (this.selectedFiles.length + newFiles.length > this.MAX_FILES) {
        alert(`Maximum ${this.MAX_FILES} képet tölthetsz fel.`);
        return;
      }

      this.selectedFiles.push(...newFiles);
      console.log('Kiválasztott fájlok:', this.selectedFiles);
    }




    uploadImages(): Observable<any> {
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        console.warn('Nincs kiválasztott fájl!');
        return of([]); // üres observable, hogy ne dobjon hibát
      }

      return this.uploadService.uploadFiles(this.selectedFiles).pipe(
        tap(results => {
          this.uploadUrls = results.map((r: any) => r.secure_url);
          console.log('✅ Feltöltve:', this.uploadUrls);
        })
      );
    }



      removeImage(index: number) {
        this.selectedFiles.splice(index, 1);
        this.uploadUrls.splice(index, 1);
      }


}
