import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasCotaParlamentarComponent } from './despesas-cota-parlamentar.component';

describe('DespesasCotaParlamentarComponent', () => {
  let component: DespesasCotaParlamentarComponent;
  let fixture: ComponentFixture<DespesasCotaParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespesasCotaParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespesasCotaParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
