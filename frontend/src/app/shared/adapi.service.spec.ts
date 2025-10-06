import { TestBed } from '@angular/core/testing';

import { AdapiService } from './adapi.service';

describe('AdapiService', () => {
  let service: AdapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
