import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasContainerComponent } from './perguntas-container.component';

describe('PerguntasComponent', () => {
  let component: PerguntasContainerComponent;
  let fixture: ComponentFixture<PerguntasContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerguntasContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntasContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
