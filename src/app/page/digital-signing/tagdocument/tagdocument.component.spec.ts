import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagdocumentComponent } from './tagdocument.component';

describe('TagdocumentComponent', () => {
  let component: TagdocumentComponent;
  let fixture: ComponentFixture<TagdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
