import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCotaParlamentarComponent } from './gastos-cota-parlamentar.component';

describe('GastosCotaParlamentarComponent', () => {
  let component: GastosCotaParlamentarComponent;
  let fixture: ComponentFixture<GastosCotaParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosCotaParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCotaParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
