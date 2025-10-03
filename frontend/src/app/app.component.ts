import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./product-list/product-list.component";
import { PicsUploadComponent } from "./pics-upload/pics-upload.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductListComponent, PicsUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fish-project';


}
