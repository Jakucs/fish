import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../shared/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.css'
})
export class LoadingBarComponent {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$; // itt figyeljük
  }
}
