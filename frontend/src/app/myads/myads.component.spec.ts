import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyadsComponent } from './myads.component';

describe('MyadsComponent', () => {
  let component: MyadsComponent;
  let fixture: ComponentFixture<MyadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
