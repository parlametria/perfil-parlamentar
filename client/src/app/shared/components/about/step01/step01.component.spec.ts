import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step01Component } from './step01.component';

describe('Step01Component', () => {
  let component: Step01Component;
  let fixture: ComponentFixture<Step01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
