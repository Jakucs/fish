import { TestBed } from '@angular/core/testing';

import { ResetpasswordapiService } from './resetpasswordapi.service';

describe('ResetpasswordapiService', () => {
  let service: ResetpasswordapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetpasswordapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
