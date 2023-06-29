import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualUploadComponent } from './manual-upload.component';

describe('ManualUploadComponent', () => {
  let component: ManualUploadComponent;
  let fixture: ComponentFixture<ManualUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManualUploadComponent]
    });
    fixture = TestBed.createComponent(ManualUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
