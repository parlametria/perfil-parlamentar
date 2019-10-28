import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalChartComponent } from './capital-chart.component';

describe('CapitalChartComponent', () => {
  let component: CapitalChartComponent;
  let fixture: ComponentFixture<CapitalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
