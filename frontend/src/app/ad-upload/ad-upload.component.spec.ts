import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdUploadComponent } from './ad-upload.component';

describe('AdUploadComponent', () => {
  let component: AdUploadComponent;
  let fixture: ComponentFixture<AdUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
