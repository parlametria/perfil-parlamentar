import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculosChartComponent } from './vinculos-chart.component';

describe('VinculosChartComponent', () => {
  let component: VinculosChartComponent;
  let fixture: ComponentFixture<VinculosChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinculosChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinculosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
