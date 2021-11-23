import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePadorImgComponent } from './signature-pador-img.component';

describe('SignaturePadorImgComponent', () => {
  let component: SignaturePadorImgComponent;
  let fixture: ComponentFixture<SignaturePadorImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignaturePadorImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePadorImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
