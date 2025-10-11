import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true, // ⬅️ FONTOS Angular 17+ esetén!
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'épp most';
    if (diffMin < 60) return `${diffMin} perce`;
    if (diffHour < 24) return `${diffHour} órája`;
    if (diffDay === 1) return 'tegnap';
    if (diffDay < 7) return `${diffDay} napja`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} hete`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} hónapja`;
    return `${Math.floor(diffDay / 365)} éve`;
  }
}
