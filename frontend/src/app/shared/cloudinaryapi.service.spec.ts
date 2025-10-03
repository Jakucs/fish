import { TestBed } from '@angular/core/testing';

import { CloudinaryapiService } from './cloudinaryapi.service';

describe('CloudinaryapiService', () => {
  let service: CloudinaryapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
