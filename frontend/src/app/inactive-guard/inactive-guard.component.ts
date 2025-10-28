import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inactive-guard',
  imports: [CommonModule],
  templateUrl: './inactive-guard.component.html',
  styleUrl: './inactive-guard.component.css'
})
export class InactiveGuardComponent {
  @Input() errorMessage: string = '';
}
