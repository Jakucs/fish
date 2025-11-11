import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError, debounceTime, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  apiURL = "http://localhost:8000/api"

    constructor(private http: HttpClient) {}

    phoneExistsValidator(): AsyncValidatorFn {
      return (control: AbstractControl) => {
        if (!control.value) {
          return of(null); // ha üres, nincs ellenőrzés
        }

        return of(control.value).pipe(
          debounceTime(400), // kis késleltetés, hogy ne küldjünk túl sok kérést gépeléskor
          switchMap(phone =>
            this.http
              .get<{ exists: boolean }>(`${this.apiURL}/check-phone?phone=${encodeURIComponent(phone)}`)
              .pipe(
                map(res => {
                  console.log('Backend válasz:', res);
                  return res.exists ? { phoneExists: true } : null;
                }),
                catchError(err => {
                  console.error('Backend hiba:', err);
                  return of(null);
                })
              )
          )
        );
      };
    }

}
