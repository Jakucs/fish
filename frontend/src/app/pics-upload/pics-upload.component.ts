import { Component } from '@angular/core';
import { CloudinaryapiService } from '../shared/cloudinaryapi.service';

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

  uploadImage() {
    console.log(this.selectedFile);
    if (!this.selectedFile) return;

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (res: any) => {
        console.log('Feltöltve:', res);
        this.uploadUrl = res.secure_url;
      },
      error: (err) => console.error('Feltöltési hiba:', err)
    });

  }
}
