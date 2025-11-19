import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private lastActivity = Date.now();

  constructor(private ngZone: NgZone) {
    this.initListeners();
  }

  initListeners() {
    this.ngZone.runOutsideAngular(() => {
      const reset = () => (this.lastActivity = Date.now());

      window.addEventListener('mousemove', reset);
      window.addEventListener('keydown', reset);
      window.addEventListener('click', reset);
      window.addEventListener('touchstart', reset);
    });
  }

  getLastActivity(): number {
    return this.lastActivity;
  }
}
