import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Cloudinaryapi {
  private cloudName = 'ddt30o1t2';
  private uploadPreset = 'ml_default';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder: string = 'user_uploads'): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // file ellenőrizve
    formData.append('upload_preset', this.uploadPreset); // létező preset
    formData.append('folder', folder);

    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData);
  }
}
