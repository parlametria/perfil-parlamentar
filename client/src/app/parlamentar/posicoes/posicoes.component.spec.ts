import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicoesComponent } from './posicoes.component';

describe('PosicoesComponent', () => {
  let component: PosicoesComponent;
  let fixture: ComponentFixture<PosicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
