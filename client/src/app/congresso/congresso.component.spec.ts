import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressoComponent } from './congresso.component';

describe('CongressoComponent', () => {
  let component: CongressoComponent;
  let fixture: ComponentFixture<CongressoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongressoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
