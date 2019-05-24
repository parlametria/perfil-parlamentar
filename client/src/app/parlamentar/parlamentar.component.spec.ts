import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlamentarComponent } from './parlamentar.component';

describe('ParlamentarComponent', () => {
  let component: ParlamentarComponent;
  let fixture: ComponentFixture<ParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
