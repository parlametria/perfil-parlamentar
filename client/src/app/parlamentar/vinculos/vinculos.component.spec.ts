import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculosComponent } from './vinculos.component';

describe('VinculosComponent', () => {
  let component: VinculosComponent;
  let fixture: ComponentFixture<VinculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
