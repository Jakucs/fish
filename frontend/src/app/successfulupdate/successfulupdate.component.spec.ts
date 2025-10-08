import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulupdateComponent } from './successfulupdate.component';

describe('SuccessfulupdateComponent', () => {
  let component: SuccessfulupdateComponent;
  let fixture: ComponentFixture<SuccessfulupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessfulupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
