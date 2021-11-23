import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDoucumentComponent } from './new-doucument.component';

describe('NewDoucumentComponent', () => {
  let component: NewDoucumentComponent;
  let fixture: ComponentFixture<NewDoucumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDoucumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDoucumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
