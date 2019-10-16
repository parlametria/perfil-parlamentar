import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressoChartLegendaComponent } from './congresso-chart-legenda.component';

describe('CongressoChartLegendaComponent', () => {
  let component: CongressoChartLegendaComponent;
  let fixture: ComponentFixture<CongressoChartLegendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongressoChartLegendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressoChartLegendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
