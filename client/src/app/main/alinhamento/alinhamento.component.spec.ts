import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlinhamentoComponent } from './alinhamento.component';

describe('AlinhamentoComponent', () => {
  let component: AlinhamentoComponent;
  let fixture: ComponentFixture<AlinhamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlinhamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlinhamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
