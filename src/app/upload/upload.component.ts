import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Cloudinaryapi } from '../shared/cloudinaryapi';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent  implements OnInit {

  selectedFile: File | null = null;
  uploadUrl: string = '';

  constructor(private uploadService: Cloudinaryapi){}

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