import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRemarksComponent } from './owner-remarks.component';

describe('OwnerRemarksComponent', () => {
  let component: OwnerRemarksComponent;
  let fixture: ComponentFixture<OwnerRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
