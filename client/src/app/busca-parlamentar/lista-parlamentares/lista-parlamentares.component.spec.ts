import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParlamentaresComponent } from './lista-parlamentares.component';

describe('ListaParlamentaresComponent', () => {
  let component: ListaParlamentaresComponent;
  let fixture: ComponentFixture<ListaParlamentaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaParlamentaresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaParlamentaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
