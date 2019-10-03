import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AderenciaParlamentaresComponent } from './aderencia-parlamentares.component';

describe('AderenciaParlamentaresComponent', () => {
  let component: AderenciaParlamentaresComponent;
  let fixture: ComponentFixture<AderenciaParlamentaresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AderenciaParlamentaresComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AderenciaParlamentaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
