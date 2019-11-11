import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalComponent } from './capital.component';

describe('CapitalComponent', () => {
  let component: CapitalComponent;
  let fixture: ComponentFixture<CapitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
