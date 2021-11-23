import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSigningComponent } from './digital-signing.component';

describe('DigitalSigningComponent', () => {
  let component: DigitalSigningComponent;
  let fixture: ComponentFixture<DigitalSigningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalSigningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
