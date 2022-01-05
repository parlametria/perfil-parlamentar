import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrimonioChartComponent } from './patrimonio-chart.component';

describe('PatrimonioChartComponent', () => {
  let component: PatrimonioChartComponent;
  let fixture: ComponentFixture<PatrimonioChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrimonioChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrimonioChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
