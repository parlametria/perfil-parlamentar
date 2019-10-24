import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressoAlinhamentoComponent } from './congresso-alinhamento.component';

describe('CongressoAlinhamentoComponent', () => {
  let component: CongressoAlinhamentoComponent;
  let fixture: ComponentFixture<CongressoAlinhamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongressoAlinhamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressoAlinhamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
