import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginslideComponent } from './loginslide.component';

describe('LoginslideComponent', () => {
  let component: LoginslideComponent;
  let fixture: ComponentFixture<LoginslideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginslideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginslideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
