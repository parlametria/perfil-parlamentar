import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AderenciaComponent } from './aderencia.component';

describe('AderenciaComponent', () => {
  let component: AderenciaComponent;
  let fixture: ComponentFixture<AderenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AderenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AderenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
