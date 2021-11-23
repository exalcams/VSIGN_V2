import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorSignPageComponent } from './cursor-sign-page.component';

describe('CursorSignPageComponent', () => {
  let component: CursorSignPageComponent;
  let fixture: ComponentFixture<CursorSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursorSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursorSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
