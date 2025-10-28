import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveGuardComponent } from './inactive-guard.component';

describe('InactiveGuardComponent', () => {
  let component: InactiveGuardComponent;
  let fixture: ComponentFixture<InactiveGuardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveGuardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
