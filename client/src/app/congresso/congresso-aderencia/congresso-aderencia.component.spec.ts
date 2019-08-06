import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressoAderenciaComponent } from './congresso-aderencia.component';

describe('CongressoAderenciaComponent', () => {
  let component: CongressoAderenciaComponent;
  let fixture: ComponentFixture<CongressoAderenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongressoAderenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressoAderenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
