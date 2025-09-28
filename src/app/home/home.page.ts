import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { UploadComponent } from '../upload/upload.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, CommonModule, UploadComponent],
  providers: [HttpClient]
})
export class HomePage {

  searchText: string = '';

  constructor() {}

  onSearch(){
    console.log('Keresett kifejezés:', this.searchText)
  }
}
