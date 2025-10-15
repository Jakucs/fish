import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyImagesComponent } from './modify-images.component';

describe('ModifyImagesComponent', () => {
  let component: ModifyImagesComponent;
  let fixture: ComponentFixture<ModifyImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
