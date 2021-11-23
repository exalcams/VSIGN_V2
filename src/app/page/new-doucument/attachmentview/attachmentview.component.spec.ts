import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentviewComponent } from './attachmentview.component';

describe('AttachmentviewComponent', () => {
  let component: AttachmentviewComponent;
  let fixture: ComponentFixture<AttachmentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
