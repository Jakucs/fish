import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CloudinaryapiService } from '../shared/cloudinaryapi.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PicsShareService } from '../shared/pics-share.service';


@Component({
  selector: 'app-pics-upload',
  imports: [CommonModule],
  templateUrl: './pics-upload.component.html',
  styleUrl: './pics-upload.component.css'
})
export class PicsUploadComponent {
  @Output() uploadComplete = new EventEmitter<string[]>(); //Outputot és EventMittert importáltuk, hogy együtt tudjuk használni a modify-images komponensel.
  @Input() existingImagesCount: number = 0; // hány kép van már feltöltve

  selectedFiles: any[] = [];
  uploadUrls: string[] = [];
  lastUploadedPublicIds: string[] = []; //if we need to delete the images later
  readonly MAX_FILES = 10;

  constructor(
    private uploadService: CloudinaryapiService,
    private picsshare: PicsShareService
  ){}

    ngOnInit() {
      
    }

    onUploadComplete(urls: string[]) {
      this.uploadUrls = urls;
      this.picsshare.updateUrls(this.uploadUrls);
  }

    onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const newFiles = Array.from(input.files);

  // ❌ Összesen ne legyen több mint MAX_FILES (pl. 10)
  if (this.existingImagesCount + this.selectedFiles.length + newFiles.length > this.MAX_FILES) {
    alert(`Maximum ${this.MAX_FILES} képet tölthetsz fel összesen.`);
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

          // Itt adjuk át a képeket a többi komponensnek
          this.picsshare.updateUrls(this.uploadUrls);
        })
      );
    }



    removeImage(index: number) {
      this.selectedFiles.splice(index, 1);
      this.uploadUrls.splice(index, 1);
    }


}
