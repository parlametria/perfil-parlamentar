import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBuscaParlamentarComponent } from './card-busca-parlamentar.component';

describe('CardBuscaParlamentarComponent', () => {
  let component: CardBuscaParlamentarComponent;
  let fixture: ComponentFixture<CardBuscaParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBuscaParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBuscaParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
