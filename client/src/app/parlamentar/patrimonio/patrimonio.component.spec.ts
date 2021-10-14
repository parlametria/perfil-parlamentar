import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrimonioComponent } from './patrimonio.component';

describe('PatrimonioComponent', () => {
  let component: PatrimonioComponent;
  let fixture: ComponentFixture<PatrimonioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrimonioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
