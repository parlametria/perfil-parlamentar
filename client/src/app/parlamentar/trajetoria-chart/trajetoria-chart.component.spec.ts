import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetoriaChartComponent } from './trajetoria-chart.component';

describe('TrajetoriaChartComponent', () => {
  let component: TrajetoriaChartComponent;
  let fixture: ComponentFixture<TrajetoriaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetoriaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetoriaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
