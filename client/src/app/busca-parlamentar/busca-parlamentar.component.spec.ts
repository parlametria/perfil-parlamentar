import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaParlamentarComponent } from './busca-parlamentar.component';

describe('BuscaParlamentarComponent', () => {
  let component: BuscaParlamentarComponent;
  let fixture: ComponentFixture<BuscaParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscaParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
