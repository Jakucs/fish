import { TestBed } from '@angular/core/testing';

import { Cloudinaryapi } from './cloudinaryapi';

describe('Cloudinaryapi', () => {
  let service: Cloudinaryapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cloudinaryapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
