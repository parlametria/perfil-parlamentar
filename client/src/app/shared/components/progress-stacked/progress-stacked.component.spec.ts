import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressStackedComponent } from './progress-stacked.component';

describe('ProgressStackedComponent', () => {
  let component: ProgressStackedComponent;
  let fixture: ComponentFixture<ProgressStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
