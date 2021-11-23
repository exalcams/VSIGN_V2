import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AadhardocumentsComponent } from './aadhardocuments.component';

describe('AadhardocumentsComponent', () => {
  let component: AadhardocumentsComponent;
  let fixture: ComponentFixture<AadhardocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AadhardocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AadhardocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
