import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReembolsoComponent } from './card-reembolso.component';

describe('CardReembolsoComponent', () => {
  let component: CardReembolsoComponent;
  let fixture: ComponentFixture<CardReembolsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardReembolsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
