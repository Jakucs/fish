import { TestBed } from '@angular/core/testing';

import { PicsShareService } from './pics-share.service';

describe('PicsShareService', () => {
  let service: PicsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
