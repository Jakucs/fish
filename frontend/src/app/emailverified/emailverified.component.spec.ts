import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailverifiedComponent } from './emailverified.component';

describe('EmailverifiedComponent', () => {
  let component: EmailverifiedComponent;
  let fixture: ComponentFixture<EmailverifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailverifiedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailverifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
