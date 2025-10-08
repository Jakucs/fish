import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicsShareService {
  private urlsSource = new BehaviorSubject<string[]>([]);
  urls$ = this.urlsSource.asObservable();

  updateUrls(urls: string[]) {
    this.urlsSource.next(urls);
  }
}
