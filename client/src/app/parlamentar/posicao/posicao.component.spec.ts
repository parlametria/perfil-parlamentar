import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicaoComponent } from './posicao.component';

describe('PosicaoComponent', () => {
  let component: PosicaoComponent;
  let fixture: ComponentFixture<PosicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
