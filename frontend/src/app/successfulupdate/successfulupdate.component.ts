import { Component } from '@angular/core';
import { PicsShareService } from '../shared/pics-share.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successfulupdate',
  imports: [CommonModule],
  templateUrl: './successfulupdate.component.html',
  styleUrl: './successfulupdate.component.css'
})
export class SuccessfulupdateComponent {

    urls: string[] = [];

    constructor(private picsState: PicsShareService, private router: Router) {}

    ngOnInit(): void {
      this.picsState.urls$.subscribe(urls => {
        this.urls = urls;
      });
    }

    goToMyAds() {
      this.router.navigate(['/myads']);
    }

}
