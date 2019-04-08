import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlamentoComponent } from './parlamento.component';

describe('ParlamentoComponent', () => {
  let component: ParlamentoComponent;
  let fixture: ComponentFixture<ParlamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParlamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParlamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
