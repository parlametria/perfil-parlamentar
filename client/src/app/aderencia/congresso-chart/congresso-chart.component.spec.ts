import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressoChartComponent } from './congresso-chart.component';

describe('CongressoChartComponent', () => {
  let component: CongressoChartComponent;
  let fixture: ComponentFixture<CongressoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongressoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
