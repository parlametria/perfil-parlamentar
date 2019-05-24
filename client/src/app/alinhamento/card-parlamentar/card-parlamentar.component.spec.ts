import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardParlamentarComponent } from './card-parlamentar.component';

describe('CardParlamentarComponent', () => {
  let component: CardParlamentarComponent;
  let fixture: ComponentFixture<CardParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
